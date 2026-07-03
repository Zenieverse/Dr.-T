import OSS from 'ali-oss';
import Core from '@alicloud/pop-core';

export interface AlibabaConfig {
  accessKeyId?: string;
  accessKeySecret?: string;
  region: string;
  bucket?: string;
}

let ossClient: any = null;
let popClient: any = null;

export function hasAlibabaCredentials(): boolean {
  return !!(process.env.ALIBABA_CLOUD_ACCESS_KEY_ID && process.env.ALIBABA_CLOUD_ACCESS_KEY_SECRET);
}

export function getAlibabaConfig(): AlibabaConfig {
  const accessKeyId = process.env.ALIBABA_CLOUD_ACCESS_KEY_ID;
  const accessKeySecret = process.env.ALIBABA_CLOUD_ACCESS_KEY_SECRET;
  const region = process.env.ALIBABA_CLOUD_REGION || 'cn-hangzhou';
  const bucket = process.env.ALIBABA_CLOUD_OSS_BUCKET;

  return { accessKeyId, accessKeySecret, region, bucket };
}

export function getOSSClient() {
  if (!ossClient) {
    const config = getAlibabaConfig();
    if (!config.accessKeyId || !config.accessKeySecret) {
      throw new Error("ALIBABA_CLOUD_ACCESS_KEY_ID and ALIBABA_CLOUD_ACCESS_KEY_SECRET are required to initialize the OSS Client.");
    }
    if (!config.bucket) {
      throw new Error("ALIBABA_CLOUD_OSS_BUCKET environment variable is required to initialize the OSS Object Storage Client.");
    }
    // We use dynamic ali-oss instantiation
    ossClient = new (OSS as any)({
      region: `oss-${config.region}`,
      accessKeyId: config.accessKeyId,
      accessKeySecret: config.accessKeySecret,
      bucket: config.bucket,
      secure: true,
    });
  }
  return ossClient;
}

export function getPopClient() {
  if (!popClient) {
    const config = getAlibabaConfig();
    if (!config.accessKeyId || !config.accessKeySecret) {
      throw new Error("ALIBABA_CLOUD_ACCESS_KEY_ID and ALIBABA_CLOUD_ACCESS_KEY_SECRET are required to initialize the POP Core Client.");
    }
    popClient = new (Core as any)({
      accessKeyId: config.accessKeyId,
      accessKeySecret: config.accessKeySecret,
      endpoint: `https://ecs.${config.region}.aliyuncs.com`,
      apiVersion: '2014-05-26',
    });
  }
  return popClient;
}

/**
 * Call the Alibaba Cloud ECS API to describe regions.
 * Gracefully falls back to sandbox emulation when credentials are not configured.
 */
export async function testAlibabaCloudConnection(): Promise<any> {
  if (!hasAlibabaCredentials()) {
    // Elegant sandbox mode fallback
    return {
      success: true,
      isSandbox: true,
      message: "Successfully loaded Alibaba Cloud Console in Sandbox Simulation Mode. (Set ALIBABA_CLOUD_ACCESS_KEY_ID to connect to your live billing account)",
      regions: [
        { "RegionId": "cn-hangzhou", "LocalName": "China (Hangzhou)", "RegionEndpoint": "ecs.cn-hangzhou.aliyuncs.com" },
        { "RegionId": "cn-shanghai", "LocalName": "China (Shanghai)", "RegionEndpoint": "ecs.cn-shanghai.aliyuncs.com" },
        { "RegionId": "cn-beijing", "LocalName": "China (Beijing)", "RegionEndpoint": "ecs.cn-beijing.aliyuncs.com" },
        { "RegionId": "cn-shenzhen", "LocalName": "China (Shenzhen)", "RegionEndpoint": "ecs.cn-shenzhen.aliyuncs.com" },
        { "RegionId": "ap-southeast-1", "LocalName": "Singapore", "RegionEndpoint": "ecs.ap-southeast-1.aliyuncs.com" },
        { "RegionId": "us-east-1", "LocalName": "US (Virginia)", "RegionEndpoint": "ecs.us-east-1.aliyuncs.com" }
      ],
      timestamp: new Date().toISOString(),
    };
  }

  try {
    const client = getPopClient();
    const params = {};
    const requestOption = {
      method: 'POST',
      formatParams: false,
    };
    
    const result = await client.request('DescribeRegions', params, requestOption);
    return {
      success: true,
      isSandbox: false,
      message: "Successfully connected to live Alibaba Cloud ECS Service!",
      regions: result.Regions?.Region || [],
      timestamp: new Date().toISOString(),
    };
  } catch (error: any) {
    console.error("Alibaba Cloud ECS connection error:", error);
    return {
      success: false,
      isSandbox: false,
      message: error.message || String(error),
      timestamp: new Date().toISOString(),
    };
  }
}

/**
 * Upload a file/report to Alibaba Cloud Object Storage Service (OSS).
 * Gracefully falls back to sandbox emulation when credentials are not configured.
 */
export async function uploadToAlibabaOSS(fileName: string, content: string): Promise<any> {
  const config = getAlibabaConfig();

  if (!hasAlibabaCredentials() || !config.bucket) {
    // Elegant sandbox mode fallback
    const mockUrl = `https://simulated-bucket.oss-${config.region || 'cn-hangzhou'}.aliyuncs.com/${encodeURIComponent(fileName)}`;
    return {
      success: true,
      isSandbox: true,
      url: mockUrl,
      name: fileName,
      message: "Simulation: File content written successfully to Alibaba Cloud OSS sandbox storage layer.",
      timestamp: new Date().toISOString(),
    };
  }

  try {
    const client = getOSSClient();
    const buffer = Buffer.from(content, 'utf-8');
    const result = await client.put(fileName, buffer);
    return {
      success: true,
      isSandbox: false,
      url: result.url,
      name: result.name,
      message: "Successfully uploaded to your live Alibaba Cloud OSS Bucket!",
      timestamp: new Date().toISOString(),
    };
  } catch (error: any) {
    console.error("Alibaba Cloud OSS upload error:", error);
    return {
      success: false,
      isSandbox: false,
      message: error.message || String(error),
      timestamp: new Date().toISOString(),
    };
  }
}
