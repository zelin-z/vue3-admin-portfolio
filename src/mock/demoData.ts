import type { AxiosRequestConfig } from "axios";

type MockResponse = {
  code: number;
  message: string;
  ok: boolean;
  data: unknown;
};

const success = (data: unknown = null, message = "操作成功"): MockResponse => ({
  code: 200,
  message,
  ok: true,
  data,
});

const error = (message = "请求失败"): MockResponse => ({
  code: 201,
  message,
  ok: false,
  data: null,
});

const now = "2026-01-15 10:00:00";

type DemoUser = {
  id: number;
  createTime: string;
  updateTime: string;
  username: string;
  password: string;
  name: string;
  phone: null;
  roleName: string;
};

let users: DemoUser[] = [
  {
    id: 1,
    createTime: now,
    updateTime: now,
    username: "admin",
    password: "111111",
    name: "超级管理员",
    phone: null,
    roleName: "超级管理员",
  },
  {
    id: 2,
    createTime: now,
    updateTime: now,
    username: "product",
    password: "111111",
    name: "商品运营",
    phone: null,
    roleName: "商品运营",
  },
  {
    id: 3,
    createTime: now,
    updateTime: now,
    username: "viewer",
    password: "111111",
    name: "只读访客",
    phone: null,
    roleName: "只读用户",
  },
];

let roles = [
  { id: 1, createTime: now, updateTime: now, roleName: "超级管理员", remark: "拥有全部菜单和按钮权限" },
  { id: 2, createTime: now, updateTime: now, roleName: "商品运营", remark: "仅拥有商品管理相关菜单" },
  { id: 3, createTime: now, updateTime: now, roleName: "只读用户", remark: "仅可访问首页和数据大屏" },
];

const demoProfiles: Record<
  string,
  {
    routes: string[];
    buttons: string[];
    roles: string[];
    name: string;
    avatar: string;
  }
> = {
  admin: {
    routes: ["Acl", "User", "Role", "Permission", "Product", "Trademark", "Attr", "Spu"],
    buttons: ["btn.TradeMark.add"],
    roles: ["超级管理员"],
    name: "admin",
    avatar: "https://dummyimage.com/80x80/409eff/ffffff&text=Admin",
  },
  product: {
    routes: ["Product", "Trademark", "Attr", "Spu"],
    buttons: ["btn.TradeMark.add"],
    roles: ["商品运营"],
    name: "product",
    avatar: "https://dummyimage.com/80x80/67c23a/ffffff&text=Ops",
  },
  viewer: {
    routes: [],
    buttons: [],
    roles: ["只读用户"],
    name: "viewer",
    avatar: "https://dummyimage.com/80x80/909399/ffffff&text=View",
  },
};

let trademarks = [
  { id: 1, tmName: "Apple", logoUrl: "https://dummyimage.com/120x120/409eff/ffffff&text=Apple" },
  { id: 2, tmName: "Huawei", logoUrl: "https://dummyimage.com/120x120/67c23a/ffffff&text=Huawei" },
  { id: 3, tmName: "Xiaomi", logoUrl: "https://dummyimage.com/120x120/e6a23c/ffffff&text=Mi" },
  { id: 4, tmName: "OPPO", logoUrl: "https://dummyimage.com/120x120/f56c6c/ffffff&text=OPPO" },
  { id: 5, tmName: "vivo", logoUrl: "https://dummyimage.com/120x120/909399/ffffff&text=vivo" },
];

const permissions = [
  {
    id: 1,
    createTime: now,
    updateTime: now,
    pid: 0,
    name: "全部数据",
    code: "All",
    toCode: "All",
    type: 1,
    status: null,
    level: 1,
    select: true,
    children: [
      {
        id: 2,
        createTime: now,
        updateTime: now,
        pid: 1,
        name: "权限管理",
        code: "Acl",
        toCode: "Acl",
        type: 1,
        status: null,
        level: 2,
        select: true,
        children: [
          { id: 3, createTime: now, updateTime: now, pid: 2, name: "用户管理", code: "User", toCode: "User", type: 1, status: null, level: 3, select: true },
          { id: 4, createTime: now, updateTime: now, pid: 2, name: "角色管理", code: "Role", toCode: "Role", type: 1, status: null, level: 3, select: true },
          { id: 5, createTime: now, updateTime: now, pid: 2, name: "菜单管理", code: "Permission", toCode: "Permission", type: 1, status: null, level: 3, select: true },
        ],
      },
      {
        id: 6,
        createTime: now,
        updateTime: now,
        pid: 1,
        name: "商品管理",
        code: "Product",
        toCode: "Product",
        type: 1,
        status: null,
        level: 2,
        select: true,
        children: [
          { id: 7, createTime: now, updateTime: now, pid: 6, name: "品牌管理", code: "Trademark", toCode: "Trademark", type: 1, status: null, level: 3, select: true },
          { id: 8, createTime: now, updateTime: now, pid: 6, name: "属性管理", code: "Attr", toCode: "Attr", type: 1, status: null, level: 3, select: true },
          { id: 9, createTime: now, updateTime: now, pid: 6, name: "SPU管理", code: "Spu", toCode: "Spu", type: 1, status: null, level: 3, select: true },
        
        ],
      },
    ],
  },
];

const categories1 = [
  { id: 1, name: "手机数码" },
  { id: 2, name: "电脑办公" },
];

const categories2: Record<string, { id: number; name: string; category1Id: number }[]> = {
  "1": [
    { id: 11, name: "手机通讯", category1Id: 1 },
    { id: 12, name: "智能穿戴", category1Id: 1 },
  ],
  "2": [
    { id: 21, name: "笔记本", category1Id: 2 },
    { id: 22, name: "外设产品", category1Id: 2 },
  ],
};

const categories3: Record<string, { id: number; name: string; category2Id: number }[]> = {
  "11": [
    { id: 111, name: "旗舰手机", category2Id: 11 },
    { id: 112, name: "折叠屏", category2Id: 11 },
  ],
  "12": [
    { id: 121, name: "智能手表", category2Id: 12 },
    { id: 122, name: "运动手环", category2Id: 12 },
  ],
  "21": [
    { id: 211, name: "轻薄本", category2Id: 21 },
    { id: 212, name: "游戏本", category2Id: 21 },
  ],
  "22": [
    { id: 221, name: "键盘", category2Id: 22 },
    { id: 222, name: "鼠标", category2Id: 22 },
  ],
};

let attrs = [
  {
    id: 1,
    attrName: "颜色",
    categoryId: 111,
    categoryLevel: 3,
    attrValueList: [
      { id: 1, valueName: "黑色", attrId: 1 },
      { id: 2, valueName: "银色", attrId: 1 },
    ],
  },
  {
    id: 2,
    attrName: "内存",
    categoryId: 111,
    categoryLevel: 3,
    attrValueList: [
      { id: 3, valueName: "8GB", attrId: 2 },
      { id: 4, valueName: "16GB", attrId: 2 },
    ],
  },
];

const spuRecords = [
  { id: 1, spuName: "iPhone Pro 系列", description: "旗舰影像与高性能芯片", category3Id: 111, tmId: 1, spuSaleAttrList: null, spuImageList: null },
  { id: 2, spuName: "Mate 系列", description: "商务旗舰与长续航", category3Id: 111, tmId: 2, spuSaleAttrList: null, spuImageList: null },
  { id: 3, spuName: "Redmi 性价比系列", description: "高性价比大众机型", category3Id: 111, tmId: 3, spuSaleAttrList: null, spuImageList: null },
];

const pageData = <T>(records: T[], page = 1, limit = 10) => {
  const start = (page - 1) * limit;
  const list = records.slice(start, start + limit);
  return {
    records: list,
    total: records.length,
    size: limit,
    current: page,
    orders: [],
    optimizaCountSql: true,
    hitCount: false,
    countId: null,
    maxLimit: null,
    searchCount: true,
    pages: Math.max(1, Math.ceil(records.length / limit)),
  };
};

const getPath = (config: AxiosRequestConfig) => {
  const baseURL = config.baseURL || "";
  const url = config.url || "";
  return `${baseURL}${url}`.replace(/^https?:\/\/[^/]+/, "");
};

const getBody = (data: unknown) => {
  if (!data) return {};
  if (typeof data === "string") {
    try {
      return JSON.parse(data);
    } catch {
      return {};
    }
  }
  return data as Record<string, unknown>;
};

const getHeader = (config: AxiosRequestConfig, name: string) => {
  const headers = config.headers as any;
  return headers?.[name] || headers?.[name.toLowerCase()] || (typeof headers?.get === "function" ? headers.get(name) : "");
};

const createDemoToken = (username: string) => `DemoToken:${username}`;

const getUsernameFromToken = (config: AxiosRequestConfig) => {
  const token = String(getHeader(config, "token") || "");
  return token.startsWith("DemoToken:") ? token.replace("DemoToken:", "") : "admin";
};

export const mockRequest = (config: AxiosRequestConfig): MockResponse => {
  const path = getPath(config);
  const method = (config.method || "get").toLowerCase();
  const body = getBody(config.data);

  if (path.includes("/admin/acl/index/login") && method === "post") {
    const username = String(body.username || "");
    const password = String(body.password || "");
    const matched = users.find((item) => item.username === username && item.password === password);
    return matched ? success({ token: createDemoToken(matched.username) }, "登录成功") : error("账号或密码不正确");
  }

  if (path.includes("/admin/acl/index/info")) {
    const username = getUsernameFromToken(config);
    const profile = demoProfiles[username];
    return profile ? success(profile, "获取用户信息成功") : error("登录已过期，请重新登录");
  }

  if (path.includes("/admin/acl/index/logout")) {
    return success(null, "退出成功");
  }

  if (path.includes("/admin/acl/user/") && method === "get") {
    const match = path.match(/\/admin\/acl\/user\/(\d+)\/(\d+)/);
    const page = Number(match?.[1] || 1);
    const limit = Number(match?.[2] || 10);
    const username = String((config.params as Record<string, unknown> | undefined)?.username || "");
    const filtered = username ? users.filter((user) => user.username.includes(username)) : users;
    return success(pageData(filtered, page, limit));
  }

  if (path.includes("/admin/acl/user/save") && method === "post") {
    users.push({ id: Date.now(), createTime: now, updateTime: now, roleName: "普通用户", phone: null, ...body });
    return success(null, "添加用户成功");
  }

  if (path.includes("/admin/acl/user/update") && method === "put") {
    users = users.map((item) => item.id === body.id ? { ...item, ...body, updateTime: now } : item);
    return success(null, "更新用户成功");
  }

  if (path.includes("/admin/acl/user/toAssign/")) {
    return success({ assignRoles: [roles[0]], allRolesList: roles });
  }

  if (path.includes("/admin/acl/user/doAssignRole")) {
    return success(null, "角色分配成功");
  }

  if (path.includes("/admin/acl/user/remove/") || path.includes("/admin/acl/user/batchRemove")) {
    return success(null, "删除成功");
  }

  if (path.includes("/admin/acl/role/") && method === "get") {
    const match = path.match(/\/admin\/acl\/role\/(\d+)\/(\d+)/);
    const page = Number(match?.[1] || 1);
    const limit = Number(match?.[2] || 10);
    const roleName = String((config.params as Record<string, unknown> | undefined)?.roleName || "");
    const filtered = roleName ? roles.filter((role) => role.roleName.includes(roleName)) : roles;
    return success(pageData(filtered, page, limit));
  }

  if (path.includes("/admin/acl/role/save") || path.includes("/admin/acl/role/update")) {
    return success(null, "角色保存成功");
  }

  if (path.includes("/admin/acl/permission/toAssign/")) {
    return success(permissions);
  }

  if (path.includes("/admin/acl/permission/doAssign")) {
    return success(null, "权限分配成功");
  }

  if (path.includes("/admin/acl/role/remove/")) {
    return success(null, "角色删除成功");
  }

  if (path.endsWith("/admin/acl/permission") && method === "get") {
    return success(permissions);
  }

  if (path.includes("/admin/acl/permission/save") || path.includes("/admin/acl/permission/update") || path.includes("/admin/acl/permission/remove/")) {
    return success(null, "菜单操作成功");
  }

  if (/\/admin\/product\/baseTrademark\/\d+\/\d+/.test(path) && method === "get") {
    const match = path.match(/\/baseTrademark\/(\d+)\/(\d+)/);
    const page = Number(match?.[1] || 1);
    const limit = Number(match?.[2] || 10);
    return success(pageData(trademarks, page, limit));
  }

  if (path.includes("/admin/product/baseTrademark/getTrademarkList")) {
    return success(trademarks);
  }

  if (path.includes("/admin/product/baseTrademark/save") && method === "post") {
    trademarks.push({ id: Date.now(), tmName: String(body.tmName || "新品牌"), logoUrl: String(body.logoUrl || "https://dummyimage.com/120x120/409eff/ffffff&text=Logo") });
    return success(null, "品牌添加成功");
  }

  if (path.includes("/admin/product/baseTrademark/update") && method === "put") {
    trademarks = trademarks.map((item) => item.id === body.id ? { ...item, ...body } : item);
    return success(null, "品牌更新成功");
  }

  if (path.includes("/admin/product/baseTrademark/remove/")) {
    return success(null, "品牌删除成功");
  }

  if (path.includes("/admin/product/getCategory1")) {
    return success(categories1);
  }

  if (path.includes("/admin/product/getCategory2/")) {
    const id = path.split("/").pop() || "";
    return success(categories2[id] || []);
  }

  if (path.includes("/admin/product/getCategory3/")) {
    const id = path.split("/").pop() || "";
    return success(categories3[id] || []);
  }

  if (path.includes("/admin/product/attrInfoList/")) {
    return success(attrs);
  }

  if (path.includes("/admin/product/saveAttrInfo")) {
    return success(null, "属性保存成功");
  }

  if (path.includes("/admin/product/deleteAttr/")) {
    return success(null, "属性删除成功");
  }

  if (/\/admin\/product\/\d+\/\d+/.test(path)) {
    const match = path.match(/\/admin\/product\/(\d+)\/(\d+)/);
    const page = Number(match?.[1] || 1);
    const limit = Number(match?.[2] || 10);
    return success(pageData(spuRecords, page, limit));
  }

  if (path.includes("/admin/product/spuImageList")) {
    return success([
      { id: 1, spuId: 1, imgName: "商品图 1", imgUrl: "https://dummyimage.com/160x160/409eff/ffffff&text=SPU" },
    ]);
  }

  if (path.includes("/admin/product/spuSaleAttrList")) {
    return success([
      {
        id: 1,
        spuId: 1,
        baseSaleAttrId: 1,
        saleAttrName: "颜色",
        spuSaleAttrValueList: [{ id: 1, baseSaleAttrId: 1, saleAttrName: "颜色" }],
      },
    ]);
  }

  if (path.includes("/admin/product/baseSaleAttrList")) {
    return success([
      { id: 1, name: "颜色" },
      { id: 2, name: "版本" },
      { id: 3, name: "尺码" },
    ]);
  }

  if (path.includes("/admin/product/saveSpuInfo")) {
    return success(null, "SPU保存成功");
  }

  return success(null, `演示模式：${method.toUpperCase()} ${path}`);
};
