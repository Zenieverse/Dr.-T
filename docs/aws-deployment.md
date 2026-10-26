# ☁️ AWS Graviton & Serverless Deployment Guide

**OpenCV AI Competition 2026 (Powered by AWS)**  
**Project:** Dr. T Vision Alert  
**Target Architecture:** AWS Graviton3/4 (ARM64), AWS Lambda, Amazon API Gateway, Amazon S3, Amazon CloudWatch

---

## 1. Architectural Topology

Dr. T Vision Alert leverages an entirely serverless, event-driven topology optimized for low-latency computer vision and stringent medical privacy compliance:

```
[ Client: Web Browser / Mobile Camera ]
                   │
                   ▼ (HTTPS TLS 1.3 / POST /vision-alert/process)
     ┌─────────────────────────────┐
     │  Amazon API Gateway (HTTP)  │
     │  - Strict CORS              │
     │  - Rate Limiting & Throttling│
     └─────────────┬───────────────┘
                   │
                   ▼
     ┌─────────────────────────────┐
     │  AWS Lambda (ARM64)         │
     │  - AWS Graviton3/4          │
     │  - OpenCV 5 COOL & KleidiCV │
     │  - 1024 MB RAM (2 vCPU)     │
     └──────┬───────────────┬──────┘
            │               │
            ▼               ▼
 ┌────────────────────┐ ┌───────────────────────┐
 │ Ephemeral S3 Bucket│ │ Amazon CloudWatch     │
 │ - Auto-Purge: 1 Day│ │ - Metric Alarms       │
 │ - SSE-S3 Encrypted │ │ - 7-Day Log Retention │
 └────────────────────┘ └───────────────────────┘
```

---

## 2. Infrastructure as Code (IaC)

Both **AWS CloudFormation** and **HashiCorp Terraform** configurations are maintained in source control:

* **CloudFormation Template:** `/aws/cloudformation/vision-alert-stack.yaml`
* **Terraform Specification:** `/aws/terraform/main.tf`
* **Lambda Handler Source:** `/aws/lambda/vision_alert_handler.py`

### Key IaC Invariants:
1. **Architectures:** Strictly set to `arm64` to enforce Graviton execution.
2. **Ephemeral S3 Lifecycle:** Automatically purges all diagnostic uploads after 24 hours (`ExpirationInDays: 1`).
3. **Least Privilege IAM:** Execution role permits only S3 Put/Get on the ephemeral bucket and CloudWatch metrics publishing under namespace `DrT/VisionAlert`.

---

## 3. Deployment Instructions

### Option A: AWS CloudFormation Deployment (CLI)

```bash
# 1. Validate template syntax
aws cloudformation validate-template \
  --template-body file://aws/cloudformation/vision-alert-stack.yaml

# 2. Deploy stack
aws cloudformation deploy \
  --template-file aws/cloudformation/vision-alert-stack.yaml \
  --stack-name dr-t-vision-alert-prod \
  --capabilities CAPABILITY_NAMED_IAM \
  --parameter-overrides EnvironmentName=production LambdaMemorySize=1024

# 3. Retrieve API Endpoint
aws cloudformation describe-stacks \
  --stack-name dr-t-vision-alert-prod \
  --query "Stacks[0].Outputs[?OutputKey=='ApiEndpointUrl'].OutputValue" \
  --output text
```

### Option B: Terraform Deployment

```bash
cd aws/terraform

# 1. Initialize Terraform providers
terraform init

# 2. Review execution plan
terraform plan -out=tfplan

# 3. Apply infrastructure
terraform apply tfplan

# 4. View output endpoint
terraform output api_endpoint
```

---

## 4. Cost Model & Energy Efficiency

| Component | Configuration | Monthly Workload (100k Scans) | Estimated Cost |
|---|---|---|---|
| **AWS Lambda (Graviton)** | 1024 MB, ~25 ms avg runtime | 2,500,000 GB-seconds | **$3.75** (within Free Tier) |
| **Amazon API Gateway** | HTTP API v2 | 100,000 requests | **$0.10** |
| **Amazon S3** | Ephemeral, 1-day auto-purge | ~50 GB peak active storage | **$1.15** |
| **Amazon CloudWatch** | 7-day retention, operational logs | ~2 GB log ingest | **$1.00** |
| **Total Estimated Monthly** | — | — | **~$6.00 / month** |

*Benefit of AWS Graviton3/4:* Up to **40% better price-performance** and **60% lower energy consumption** per vision inference compared to equivalent x86 instances.
