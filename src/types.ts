/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface BrandInfo {
  brandName: string;
  brandDescription: string;
  productOrService: string;
  links: string;
  mainCustomer: string;
  brandImage: string;
  differentiation: string;
  referenceBrands: string;
}

export interface ProductInfo {
  name: string;
  category: string;
  features: string;
  functions: string;
  benefits: string;
  usage: string;
  price: string;
  purchaseLink: string;
  cautions: string;
  prohibitedClaims: string;
  imageUrls: string;
}

export interface ContentStrategy {
  purpose: string[];
  contentType: string;
  topic: string;
  topicType: string;
}

export interface TargetCustomer {
  age: string;
  gender: string;
  job: string;
  interests: string;
  purchaseConcern: string;
  currentProblem: string;
  desiredResult: string;
  viewingSituation: string;
}

export interface ToneAndManner {
  tone: string[];
  additionalDirection: string;
}

export interface ImageDirection {
  imageSource: string;
  style: string;
  backgroundMood: string;
  includePerson: boolean;
  showProduct: boolean;
  brandColor: string;
  prohibitedStyle: string;
  referenceImage: string;
  visualType: string;
}

export interface CaptionRule {
  length: string;
  hookStyle: string;
  useEmoji: boolean;
  lineBreakStyle: string;
  includeHashtags: boolean;
  includeCTA: boolean;
  mentionBrandName: boolean;
  mentionProductName: boolean;
  linkGuide: string;
}

export interface HashtagRule {
  brandHashtags: string;
  productHashtags: string;
  industryHashtags: string;
  targetHashtags: string;
  trendHashtags: string;
  prohibitedHashtags: string;
  hashtagCount: number;
}

export interface ComplianceRule {
  noExaggeration: boolean;
  noFalseInfo: boolean;
  noMedicalLegalFinancialClaims: boolean;
  noCompetitorCriticism: boolean;
  noWrongPriceDiscount: boolean;
  noOverstatedEffects: boolean;
  followBrandPolicy: boolean;
  noCopyrightIssue: boolean;
  noSensitiveExpression: boolean;
  additionalNotes: string;
}

export interface PublishSetting {
  instagramAccount: string;
  publishDate: string;
  publishTime: string;
  isScheduled: boolean;
  postFormat: string;
  imageCount: number;
  includeCaption: boolean;
  requireApproval: boolean;
  publishMode: 'auto' | 'manual';
}

export interface InstagramContentPayload {
  brandInfo: BrandInfo;
  productInfo: ProductInfo;
  contentStrategy: ContentStrategy;
  targetCustomer: TargetCustomer;
  toneAndManner: ToneAndManner;
  imageDirection: ImageDirection;
  captionRule: CaptionRule;
  hashtagRule: HashtagRule;
  complianceRule: ComplianceRule;
  publishSetting: PublishSetting;
}

export interface CardNewsItem {
  slide: number;
  text: string;
}

export interface InstagramResponse {
  title: string;
  caption: string;
  hashtags: string[];
  imageUrls: string[];
  cardNews?: CardNewsItem[];
  imagePrompt?: string;
  recommends?: {
    recommendTime?: string;
    checkListPass?: string[];
  };
}
