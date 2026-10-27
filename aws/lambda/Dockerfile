# AWS Lambda Container Image for Dr. T Vision Alert
# Architecture: ARM64 (AWS Graviton3 / Graviton4)
# OpenCV AI Competition 2026 (Powered by AWS)

FROM public.ecr.aws/lambda/python:3.11-arm64

# Copy dependency specifications
COPY requirements.txt ${LAMBDA_TASK_ROOT}/

# Install headless OpenCV with ARM64 vectorization and NumPy
RUN pip install --no-cache-dir -r ${LAMBDA_TASK_ROOT}/requirements.txt

# Copy handler code
COPY vision_alert_handler.py ${LAMBDA_TASK_ROOT}/

# Set Lambda function entrypoint
CMD [ "vision_alert_handler.lambda_handler" ]
