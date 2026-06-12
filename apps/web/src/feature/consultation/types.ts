export interface ConsultationInquiryContext {
  expertUserId: string;
  serviceId: string;
  companyName: string;
  contactTime: {
    start: string;
    end: string;
  };
}

export interface ConsultationChatFile {
  key: string;
  url: string;
  fileName: string;
  fileType: string;
  fileSize: number;
}
