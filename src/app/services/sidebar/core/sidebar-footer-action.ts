export interface SidebarFooterAction {
  name: string;
  action?: () => void;
  outlined?: boolean;
  style?: string;
  class?: string;
  disabled?: boolean;
}
