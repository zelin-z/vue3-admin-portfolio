<template>
  <el-card style="height: 80px">
    <el-form :inline="true" class="form">
      <el-form-item label="用户名">
        <el-input placeholder="请你输入搜索用户名" v-model="keyword"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button
          size="default"
          type="primary"
          :disabled="keyword ? false : true"
          @click="search"
          >搜索</el-button
        >
        <el-button size="default" type="primary" @click="reset">重置</el-button>
      </el-form-item>
    </el-form>
  </el-card>
  <el-card style="margin: 10px 0px">
    <el-button type="primary" size="default" @click="addUser"
      >添加用户</el-button
    >
    <el-button
      type="primary"
      size="default"
      :disabled="selectIdAttr.length ? false : true"
      @click="deleteSelectUser"
      >批量删除</el-button
    >
    <el-table
      @selection-change="selectChange"
      style="margin: 10px 0px"
      border
      :data="userArr"
    >
      <el-table-column type="selection" align="center"></el-table-column>
      <el-table-column label="#" align="center" type="index"></el-table-column>
      <el-table-column label="ID" align="center" prop="id"></el-table-column>
      <el-table-column
        label="用户名字"
        align="center"
        prop="username"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="用户名称"
        align="center"
        prop="name"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="用户角色"
        align="center"
        prop="roleName"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="创建时间"
        align="center"
        prop="updateTime"
        show-overflow-tooltip
      ></el-table-column>
      <el-table-column
        label="更新时间"
        align="center"
        prop="updateTime"
      ></el-table-column>
      <el-table-column
        label="操作"
        width="300px"
        align="center"
        show-overflow-tooltip
      >
        <template #="{ row, $index }">
          <el-button
            type="primary"
            size="small"
            icon="User"
            @click="setRole(row)"
            >分配角色</el-button
          >
          <el-button
            type="primary"
            size="small"
            icon="Edit"
            @click="updateUser(row)"
            >编辑</el-button
          >
          <el-popconfirm
            :title="`你确定要删除${row.username}?`"
            width="260px"
            @confirm="deleteUser(row.id)"
          >
            <template #reference>
              <el-button type="primary" size="small" icon="Delete"
                >删除</el-button
              >
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
  </el-card>
  <el-pagination
    v-model:current-page="pageNo"
    v-model:page-size="pageSize"
    :page-sizes="[5, 7, 9, 11]"
    :background="true"
    layout="prev, pager, next,jumper,->,sizes,total"
    :total="total"
    @current-change="getHasUser"
    @size-change="handler"
  />
  <el-drawer v-model="drawer">
    <template #header>
      <h4>{{ userParams.id ? "更新用户" : "修改用户" }}</h4>
    </template>
    <template #default>
      <el-form :model="userParams" :rules="rules" ref="formRef">
        <el-form-item label="用户姓名" prop="username">
          <el-input
            placeholder="请您输入用户姓名"
            v-model="userParams.username"
          ></el-input>
        </el-form-item>
        <el-form-item label="用户昵称" prop="name">
          <el-input
            placeholder="请您输入用户昵称"
            v-model="userParams.name"
          ></el-input>
        </el-form-item>
        <el-form-item label="用户密码" prop="password" v-if="!userParams.id">
          <el-input
            placeholder="请您输入用户密码"
            v-model="userParams.password"
          ></el-input>
        </el-form-item>
      </el-form>
    </template>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="save">确定</el-button>
      </div>
    </template>
  </el-drawer>
  <el-drawer v-model="drawer1">
    <template #header>
      <h4>分配角色(职位)</h4>
    </template>
    <template #default>
      <el-form>
        <el-form-item label="用户姓名">
          <el-input v-model="userParams.username" :disabled="true"></el-input>
        </el-form-item>
        <el-form-item label="职位列表">
          <el-checkbox
            v-model="checkAll"
            :isIndeterminate="isIndeterminate"
            @change="handleCheckAllChange"
          >
            全选
          </el-checkbox>
        </el-form-item>
        <el-checkbox-group
          v-model="userRole"
          @change="handleCheckedCitiesChange"
        >
          <el-checkbox
            v-for="(role, index) in allRole"
            :key="index"
            :label="role"
          >
            {{ role.roleName }}
          </el-checkbox>
        </el-checkbox-group>
      </el-form>
    </template>
    <template #footer>
      <div style="flex: auto">
        <el-button @click="drawer1 = false">取消</el-button>
        <el-button type="primary" @click="confirmClick">确定</el-button>
      </div>
    </template>
  </el-drawer>
</template>

<script setup lang="ts">
import { ref, onMounted, reactive, nextTick } from "vue";
import useLayOutSettingStore from "@/store/modules/setting";
import {
  reqUserInfo,
  reqAddOrUpdateUser,
  reqAllRole,
  reqSetUserRole,
  reqRemoveUser,
  reqSelectUser,
} from "@/api/acl/user";
import {
  type UserResponseData,
  type Records,
  type User,
  type AllRoleResponseData,
  AllRole,
  SetRoleData,
} from "@/api/acl/user/type";
import { ElMessage } from "element-plus";
import { reqRemoveAttr } from "@/api/product/attr";
let pageNo = ref<number>(1);
let pageSize = ref<number>(5);
let total = ref<number>(0);
let userArr = ref<Records>([]);
let drawer = ref<boolean>(false);
let userParams = reactive<User>({
  username: "",
  name: "",
  password: "",
});
let formRef = ref<any>();
let allRole = ref<AllRole>([]);
let userRole = ref<any[]>([]);
let selectIdAttr = ref<User[]>([]);
let keyword = ref<string>("");
let settingStore = useLayOutSettingStore();
onMounted(() => {
  getHasUser();
});
let drawer1 = ref<boolean>(false);
const getHasUser = async (pager = 1) => {
  pageNo.value = pager;
  let result: UserResponseData = await reqUserInfo(
    pageNo.value,
    pageSize.value,
    keyword.value
  );
  console.log(result);
  if (result.code == 200) {
    total.value = result.data.total;
    userArr.value = result.data.records;
  }
};
const handler = () => {
  getHasUser();
};
const addUser = () => {
  drawer.value = true;
  Object.assign(userParams, {
    username: "",
    name: "",
    password: "",
    id: 0,
  });
  nextTick(() => {
    formRef.value.clearValidate("username");
    formRef.value.clearValidate("name");
    formRef.value.clearValidate("password");
  });
};
const updateUser = (row: User) => {
  drawer.value = true;
  Object.assign(userParams, row);
  nextTick(() => {
    formRef.value.clearValidate("username");
    formRef.value.clearValidate("name");
  });
};
const save = async () => {
  await formRef.value.validate();
  let result: any = await reqAddOrUpdateUser(userParams);
  if (result.code == 200) {
    drawer.value = false;
    ElMessage({
      type: "success",
      message: userParams.id ? "更新成功" : "添加成功",
    });
    getHasUser(userParams.id ? pageNo.value : 1);
    window.location.reload();
  } else {
    drawer.value = false;
    ElMessage({
      type: "error",
      message: userParams.id ? "更新失败" : "添加失败",
    });
  }
};
const cancel = () => {
  drawer.value = false;
};
const validatorUsername = (rule: any, value: any, callBack: any) => {
  if (value.trim().length >= 5) {
    callBack();
  } else {
    callBack(new Error("用户名字至少五位"));
  }
};

const validatorname = (rule: any, value: any, callBack: any) => {
  if (value.trim().length >= 5) {
    callBack();
  } else {
    callBack(new Error("用户昵称至少五位"));
  }
};
const validatorpassword = (rule: any, value: any, callBack: any) => {
  if (value.trim().length >= 6) {
    callBack();
  } else {
    callBack(new Error("用户密码至少六位"));
  }
};

const rules = {
  username: [{ required: true, trigger: "blur", validator: validatorUsername }],
  name: [{ required: true, trigger: "blur", validator: validatorname }],
  password: [{ required: true, trigger: "blur", validator: validatorpassword }],
};

const setRole = async (row: User) => {
  Object.assign(userParams, row);
  let result: AllRoleResponseData = await reqAllRole(userParams.id as number);
  if (result.code == 200) {
    allRole.value = result.data.allRolesList;
    userRole.value = result.data.assignRoles;
    drawer1.value = true;
  }
};

const checkAll = ref(false);

const isIndeterminate = ref<boolean>(true);

const handleCheckAllChange = (val: any) => {
  userRole.value = val ? allRole.value : [];
  isIndeterminate.value = false;
};

const handleCheckedCitiesChange = (value: any) => {
  checkAll.value = value.length === allRole.value.length;
  isIndeterminate.value = value.length !== allRole.value.length;
};

const confirmClick = async () => {
  let data: SetRoleData = {
    userId: userParams.id as number,
    roleIdList: userRole.value.map((item) => {
      return item.id as number;
    }),
  };
  let result: any = await reqSetUserRole(data);
  if (result.code == 200) {
    ElMessage({ type: "success", message: "分配职务成功" });
    drawer1.value = false;
    getHasUser(pageNo.value);
  }
};

const deleteUser = async (userId: number) => {
  let result: any = await reqRemoveUser(userId);
  if (result.code == 200) {
    ElMessage({ type: "success", message: "删除成功" });
    getHasUser(userArr.value.length > 1 ? pageNo.value : pageNo.value - 1);
  }
};

const selectChange = (value: any) => {
  selectIdAttr.value = value;
};

const deleteSelectUser = async () => {
  let idsList: any = selectIdAttr.value.map((item) => {
    return item.id;
  });
  let result: any = await reqSelectUser(idsList);
  if (result.code == 200) {
    ElMessage({ type: "success", message: "删除成功" });
    getHasUser(userArr.value.length > 1 ? pageNo.value : pageNo.value - 1);
  }
};

const search = () => {
  getHasUser();
  keyword.value = "";
};

const reset = () => {
  settingStore.refsh = !settingStore.refsh;
};
</script>

<style scoped>
.form {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
