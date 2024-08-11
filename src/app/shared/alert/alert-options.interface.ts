export interface AlertOptions {
  title: string;
  message: string;
  buttons: { text: string; action?: () => void; color?: string }[];
}
