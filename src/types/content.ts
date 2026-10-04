export interface StepItem {
  stepNumber: number;
  stepCode: string;
  title: string;
  instruction: string;
  detailNote: string;
  imageUrl: string;
  imageAlt: string;
}

export interface YoutubeVideoInfo {
  title: string;
  description: string;
  buttonLabel: string;
  url: string;
}

export interface TopicItem {
  id: string;
  indexNumber: string;
  cardTitle: string;
  shortTitle: string;
  category: string;
  estimatedTime: string;
  summary: string;
  youtubeVideo: YoutubeVideoInfo;
  steps: StepItem[];
}

export interface ContentData {
  brand: {
    name: string;
    logoUrl: string;
    appName: string;
    supportTitle: string;
  };
  navigation: {
    homeLabel: string;
    guideLabel: string;
    videoLabel: string;
    supportLabel: string;
    endSessionLabel: string;
    backToMenuLabel: string;
  };
  home: {
    question: string;
    subtitle: string;
    actionLabel: string;
  };
  advisor: {
    name: string;
    role: string;
    phoneDisplay: string;
    phoneHref: string;
  };
  feedback: {
    questionTitle: string;
    questionSubtitle: string;
    resolvedButton: string;
    unresolvedButton: string;
    unresolvedMessage: string;
    resolvedConfirmation: string;
  };
  endConversation: {
    title: string;
    message: string;
    restartButton: string;
  };
  topics: TopicItem[];
}
