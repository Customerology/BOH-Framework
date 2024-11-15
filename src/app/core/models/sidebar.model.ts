export interface SidebarMenuItemModel {
  app_Uuid_Target: string;
  autoExpandChildren: boolean;
  description: string;
  enabled: boolean;
  id: number;
  minimumRole: number;
  requiredRights: number;
  title: string;
  urlMenuIcon: string;
  urlTarget: string;
  subMenu: SidebarMenuItemModel[];
  /* Dynamic properties created in runtime */
  route_?: string;
  isNodeExpanded_?: boolean;
  moduleTitle_?: string;
}
