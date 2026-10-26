terraform {
  required_version = ">= 1.5.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

variable "aws_region" {
  type        = string
  default     = "us-east-1"
  description = "Target AWS region for Dr. T Vision Alert Graviton deployment"
}

variable "environment" {
  type        = string
  default     = "production"
  description = "Environment identifier (development, staging, production)"
}

variable "lambda_memory_size" {
  type        = number
  default     = 1024
  description = "Memory allocation in MB (enables dual-core KleidiCV vectorization on Graviton)"
}

provider "aws" {
  region = var.aws_region
  default_tags {
    tags = {
      Project     = "DrT-VisionAlert"
      Competition = "OpenCV-AI-Competition-2026"
      ManagedBy   = "Terraform"
      Compliance  = "Zero-Retention-Diagnostic"
    }
  }
}

data "aws_caller_identity" "current" {}

# 1. Ephemeral S3 Quarantine Bucket with 1-Day Lifecycle Rule
resource "aws_s3_bucket" "ephemeral_storage" {
  bucket        = "dr-t-vision-alert-ephemeral-${data.aws_caller_identity.current.account_id}-${var.aws_region}"
  force_destroy = true
}

resource "aws_s3_bucket_lifecycle_configuration" "ephemeral_purge" {
  bucket = aws_s3_bucket.ephemeral_storage.id

  rule {
    id     = "auto-purge-24-hours"
    status = "Enabled"

    expiration {
      days = 1
    }

    noncurrent_version_expiration {
      noncurrent_days = 1
    }

    abort_incomplete_multipart_upload {
      days_after_initiation = 1
    }
  }
}

resource "aws_s3_bucket_server_side_encryption_configuration" "ephemeral_sse" {
  bucket = aws_s3_bucket.ephemeral_storage.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

resource "aws_s3_bucket_public_access_block" "ephemeral_block_public" {
  bucket                  = aws_s3_bucket.ephemeral_storage.id
  block_public_acls       = true
  block_public_policy     = true
  ignore_public_acls      = true
  restrict_public_buckets = true
}

# 2. CloudWatch Log Group with 7-Day Retention
resource "aws_cloudwatch_log_group" "lambda_log_group" {
  name              = "/aws/lambda/dr-t-vision-alert-${var.environment}"
  retention_in_days = 7
}

# 3. Least-Privilege IAM Execution Role
resource "aws_iam_role" "lambda_execution_role" {
  name = "dr-t-vision-alert-lambda-${var.environment}-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action    = "sts:AssumeRole"
        Effect    = "Allow"
        Principal = { Service = "lambda.amazonaws.com" }
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "lambda_basic" {
  role       = aws_iam_role.lambda_execution_role.name
  policy_arn = "arn:aws:iam::aws:policy/service-role/AWSLambdaBasicExecutionRole"
}

resource "aws_iam_role_policy" "ephemeral_s3_access" {
  name = "EphemeralS3TransientAccess"
  role = aws_iam_role.lambda_execution_role.id

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "s3:PutObject",
          "s3:GetObject"
        ]
        Resource = "${aws_s3_bucket.ephemeral_storage.arn}/*"
      },
      {
        Effect   = "Allow"
        Action   = "cloudwatch:PutMetricData"
        Resource = "*"
        Condition = {
          StringEquals = {
            "cloudwatch:namespace" = "DrT/VisionAlert"
          }
        }
      }
    ]
  })
}

# 4. Packaging the Lambda Function
data "archive_file" "lambda_dummy_zip" {
  type        = "zip"
  output_path = "${path.module}/vision_alert_payload.zip"

  source {
    content  = file("${path.module}/../lambda/vision_alert_handler.py")
    filename = "vision_alert_handler.py"
  }
}

# 5. Graviton ARM64 Lambda Function
resource "aws_lambda_function" "vision_alert_lambda" {
  function_name    = "dr-t-vision-alert-${var.environment}"
  role             = aws_iam_role.lambda_execution_role.arn
  handler          = "vision_alert_handler.lambda_handler"
  runtime          = "python3.11"
  architectures    = ["arm64"]
  memory_size      = var.lambda_memory_size
  timeout          = 30
  filename         = data.archive_file.lambda_dummy_zip.output_path
  source_code_hash = data.archive_file.lambda_dummy_zip.output_base64sha256

  environment {
    variables = {
      ENVIRONMENT              = var.environment
      EPHEMERAL_BUCKET         = aws_s3_bucket.ephemeral_storage.bucket
      LAPLACIAN_BLUR_THRESHOLD = "80.0"
      GLARE_RATIO_THRESHOLD    = "0.22"
      RMS_CONTRAST_THRESHOLD   = "14.0"
    }
  }

  depends_on = [aws_cloudwatch_log_group.lambda_log_group]
}

# 6. HTTP API Gateway (v2)
resource "aws_apigatewayv2_api" "http_api" {
  name          = "dr-t-vision-alert-api-${var.environment}"
  protocol_type = "HTTP"

  cors_configuration {
    allow_origins = ["https://*", "http://localhost:3000"]
    allow_methods = ["GET", "POST", "OPTIONS"]
    allow_headers = ["Content-Type", "Authorization", "X-Amz-Date", "X-Api-Key", "X-Amz-Security-Token"]
    max_age       = 3600
  }
}

resource "aws_apigatewayv2_integration" "lambda_integration" {
  api_id                 = aws_apigatewayv2_api.http_api.id
  integration_type       = "AWS_PROXY"
  integration_uri        = aws_lambda_function.vision_alert_lambda.arn
  payload_format_version = "2.0"
}

resource "aws_apigatewayv2_route" "process_route" {
  api_id    = aws_apigatewayv2_api.http_api.id
  route_key = "POST /vision-alert/process"
  target    = "integrations/${aws_apigatewayv2_integration.lambda_integration.id}"
}

resource "aws_apigatewayv2_route" "health_route" {
  api_id    = aws_apigatewayv2_api.http_api.id
  route_key = "GET /vision-alert/health"
  target    = "integrations/${aws_apigatewayv2_integration.lambda_integration.id}"
}

resource "aws_apigatewayv2_stage" "api_stage" {
  api_id      = aws_apigatewayv2_api.http_api.id
  name        = var.environment
  auto_deploy = true
}

resource "aws_lambda_permission" "api_gw_permission" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.vision_alert_lambda.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.http_api.execution_arn}/*/*"
}

output "api_endpoint" {
  description = "HTTP API Gateway endpoint URL"
  value       = "${aws_apigatewayv2_api.http_api.api_endpoint}/${var.environment}"
}

output "lambda_arn" {
  description = "ARN of the Graviton ARM64 Lambda function"
  value       = aws_lambda_function.vision_alert_lambda.arn
}

output "s3_ephemeral_bucket" {
  description = "Ephemeral quarantine S3 bucket name"
  value       = aws_s3_bucket.ephemeral_storage.bucket
}
