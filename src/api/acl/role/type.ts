export interface ResponseData {
  code: number;
  message: string;
  ok: boolean;
}

export interface RoleData {
  id?: number;
  createTime?: string;
  updateTime?: string;
  roleName: string;
  remark?: null;
}

export type Records = RoleData[];

export interface RoleResponseData extends ResponseData {
  data: {
    records: Records;
    total: number;
    size: number;
    current: number;
    orders: [];
    optimizaCountSql: boolean;
    hitCount: boolean;
    countId: null;
    maxLimit: null;
    searchCount: boolean;
    pages: number;
  };
}

export interface MunuData {
  id: number;
  createTime: string;
  updateTime: string;
  pid: number;
  name: string;
  code: string;
  toCode: string;
  type: number;
  status: null;
  level: number;
  children?: MenuList;
  select: boolean;
}

export type MenuList = MunuData[];

export interface MenuResponseData extends ResponseData {
  data: MenuList;
}
