<template>
  <div>
    <q-table
      title="用户管理"
      :data="data"
      :columns="columns"
      row-key="id"
      :filter="filter"
      :pagination.sync="pagination"
    >
      <template v-slot:top-right="props">
        <q-input
          outlined
          dense
          debounce="300"
          v-model="filter"
          placeholder="页内搜索"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>

        <q-btn
          flat
          round
          dense
          :icon="props.inFullscreen ? 'fullscreen_exit' : 'fullscreen'"
          @click="props.toggleFullscreen"
        >
          <q-tooltip :disable="$q.platform.is.mobile" v-close-popup>{{
            props.inFullscreen ? "Exit Fullscreen" : "Toggle Fullscreen"
          }}</q-tooltip>
        </q-btn>
        <q-btn
          color="primary"
          icon-right="archive"
          label="导出"
          no-caps
          @click="exportTable"
        />
      </template>

      <template v-slot:top-left>
        <div class="q-gutter-sm">
          <q-btn outline color="primary" icon="person" label="用户管理" />
        </div>
      </template>

      <template v-slot:body-cell-orgname="props">
        <q-td :props="props">
          <q-chip dense outline icon="school" color="primary">
            {{ props.value }}
          </q-chip>
        </q-td>
      </template>

      <template v-slot:body-cell-username="props">
        <q-td :props="props">
          <q-chip square dense outline icon="account_box" color="accent">
            {{ props.value }}
          </q-chip>
        </q-td>
      </template>

      <template v-slot:body-cell-nickname="props">
        <q-td :props="props">
          <q-chip square dense outline>
            <q-avatar size="xs">
              <img :src="props.row.avatar" />
            </q-avatar>
            {{ props.value }}
          </q-chip>
        </q-td>
      </template>

      <template v-slot:body-cell-action="props">
        <q-td :props="props">
          <div class="q-gutter-sm">
            <q-btn
              flat
              dense
              size="sm"
              color="primary"
              icon="edit"
              @click="handleCurrUserDetail(props.row)"
              ><q-tooltip>
                修改信息
              </q-tooltip></q-btn
            >
            <q-btn
              flat
              dense
              size="sm"
              color="red"
              icon="person_remove"
              @click="handleDeleteUser(props.row)"
            >
              <q-tooltip>
                删除用户
              </q-tooltip>
            </q-btn>
          </div>
        </q-td>
      </template>

      <template v-slot:no-data="">
        <div class="full-width row flex-center text-grey q-gutter-sm">
          <span class="text-h6">
            暂无数据
          </span>
        </div>
      </template>
    </q-table>
    <q-dialog v-model="userDetailDig">
      <q-card class="card-bg text-black">
        <q-card-section class="text-h6 ">
          <q-btn
            round
            flat
            dense
            icon="close"
            class="float-right"
            color="grey-8"
            v-close-popup
          ></q-btn>
          <div class="text-h6">用户详情</div>
          <div class="text-subtitle2">查看或编辑用户信息</div>
        </q-card-section>
        <q-card-section class="q-pa-sm">
          <q-list class="row">
            <q-item class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <q-item-section side>
                <q-avatar size="100px">
                  <img :src="currUserDetails.avatar" />
                </q-avatar>
              </q-item-section>
            </q-item>

            <q-item class="col-lg-12 col-md-12 col-sm-12 col-xs-12">
              <q-item-section>
                <q-input
                  color="black"
                  dense
                  v-model="currUserDetails.org.name"
                  label="组织"
                  disable
                />
              </q-item-section>
            </q-item>
            <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
              <q-item-section>
                <q-input
                  color="black"
                  dense
                  v-model="currUserDetails.username"
                  label="学号"
                />
              </q-item-section>
            </q-item>
            <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
              <q-item-section>
                <q-input
                  color="black"
                  dense
                  v-model="currUserDetails.nickname"
                  label="姓名"
                />
              </q-item-section>
            </q-item>
            <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
              <q-item-section>
                <q-input
                  color="black"
                  dense
                  v-model="currUserDetails.email"
                  label="邮箱"
                />
              </q-item-section>
            </q-item>
            <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
              <q-item-section>
                <q-input
                  color="black"
                  dense
                  v-model="currUserDetails.qq"
                  label="QQ号码"
                />
              </q-item-section>
            </q-item>
            <q-item class="col-lg-6 col-md-6 col-sm-12 col-xs-12">
              <q-item-section>
                <q-input
                  color="black"
                  dense
                  v-model="currUserDetails.password"
                  label="密码重置"
                />
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            class="text-capitalize bg-info text-black"
            @click="handleUpdateUserInfo"
            >保存</q-btn
          >
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { updateUser, deleteUser } from "src/api/user";
import { exportFile } from "quasar";
function wrapCsvValue(val, formatFn) {
  let formatted = formatFn !== void 0 ? formatFn(val) : val;

  formatted =
    formatted === void 0 || formatted === null ? "" : String(formatted);

  formatted = formatted.split('"').join('""');

  return `"${formatted}"`;
}
export default {
  name: "UsersTable",
  props: ["data"],
  data() {
    return {
      filter: "",
      userDetailDig: false,
      currUserDetails: {
        org: {}
      },
      columns: [
        {
          name: "orgname",
          label: "组织",
          align: "left",
          field: row => row.org.name,
          sortable: true
        },
        {
          name: "username",
          label: "学(工)号",
          align: "left",
          field: "username",
          sortable: true
        },
        {
          name: "nickname",
          align: "left",
          label: "姓名",
          field: "nickname",
          sortable: true
        },
        {
          name: "email",
          align: "left",
          label: "邮箱",
          field: "email",
          sortable: true
        },
        {
          name: "qq",
          align: "left",
          label: "QQ",
          field: "qq",
          sortable: true
        },
        {
          name: "action",
          align: "center",
          label: "操作"
        }
      ],
      pagination: {
        rowsPerPage: 10
      }
    };
  },
  methods: {
    exportTable() {
      // naive encoding to csv format
      const content = [this.columns.map(col => wrapCsvValue(col.label))]
        .concat(
          this.data.map(row =>
            this.columns
              .map(col =>
                wrapCsvValue(
                  typeof col.field === "function"
                    ? col.field(row)
                    : row[col.field === void 0 ? col.name : col.field],
                  col.format
                )
              )
              .join(",")
          )
        )
        .join("\r\n");

      const status = exportFile("users.csv", content, "text/csv");

      if (status !== true) {
        this.$q.notify({
          message: "Browser denied file download...",
          color: "negative",
          icon: "warning"
        });
      }
    },
    async handleUpdateUserInfo() {
      let updateUserDto = {};
      updateUserDto.username = this.currUserDetails.username;
      updateUserDto.nickname = this.currUserDetails.nickname;
      if (this.currUserDetails.password) {
        updateUserDto.password = this.currUserDetails.password;
      }
      updateUserDto.email = this.currUserDetails.email;
      updateUserDto.qq = this.currUserDetails.qq;
      await updateUser(this.currUserDetails.id, updateUserDto);
      this.$q.notify({
        type: "positive",
        message: "更新成功"
      });
    },
    async handleDeleteUser(user) {
      this.$q
        .dialog({
          title: "请确认",
          message: `删除用户 ${user.nickname}，操作不可恢复！`,
          ok: {
            label: "删除",
            push: true
          },
          cancel: {
            label: "取消",
            push: true,
            color: "negative"
          },
          persistent: true
        })
        .onOk(async () => {
          await deleteUser(user.id);
          // 删除本地数据
          this.data.splice(
            this.data.findIndex(item => item.id == user.id),
            1
          );
          this.$q.notify({
            message: "删除成功",
            color: "positive",
            icon: "done",
            position: "center",
            timeout: 1000
          });
        })
        .onCancel(() => {
          this.$q.notify({
            message: "操作取消",
            color: "warning",
            position: "center",
            timeout: 1000
          });
        });
    },
    handleCurrUserDetail(val) {
      this.userDetailDig = true;
      this.currUserDetails = val;
    }
  }
};
</script>
