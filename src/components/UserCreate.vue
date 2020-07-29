<template>
  <div>
    <q-table
      title="导入用户"
      :data="data"
      :columns="columns"
      row-key="id"
      :filter="filter"
      :pagination.sync="pagination"
      rows-per-page-label="单页条目数"
      no-data-label="无数据"
    >
      <template v-slot:top-left>
        <div class="q-gutter-sm">
          <q-btn
            outline
            color="primary"
            icon="cloud_upload"
            label="选择文件"
            @click="pickFileDig = true"
          />
          <q-btn
            outline
            color="primary"
            icon="clear"
            label="清除"
            @click="data = []"
          />
          <q-btn
            outline
            color="positive"
            icon="check"
            label="确认导入"
            @click="handleConfirmCreate"
          />
        </div>
      </template>

      <template v-slot:top-right>
        <q-input
          class="desktop-only"
          outlined
          dense
          debounce="300"
          v-model="filter"
          placeholder="Search"
        >
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>
      <!--
    <template v-slot:body-cell-property="props">
      <q-td :props="props">
        <q-chip
          class="glossy"
          :color="props.row.property == '提交任务' ? 'deep-orange' : 'green'"
          text-color="white"
          dense
          square
          :icon="props.row.property == '提交任务' ? 'flag' : 'how_to_vote'"
          >{{ props.row.property }}</q-chip
        >
      </q-td>
    </template> -->

      <template v-slot:no-data="">
        <div class="full-width row flex-center text-grey q-gutter-sm">
          <span class="text-h6">
            暂无数据
          </span>
        </div>
      </template>
    </q-table>
    <q-dialog v-model="pickFileDig" persistent>
      <q-card style="width:300px">
        <q-card-section class="row items-center">
          <q-file v-model="file" label="请选择文件" />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="取消" color="primary" v-close-popup />
          <q-btn
            flat
            label="确定"
            color="primary"
            v-close-popup
            @click="handleImportFromFile"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { createManyUser } from "src/api/user";
import { importExcel } from "src/utils/excel";
export default {
  name: "UserCreate",
  data() {
    return {
      filter: "",
      pickFileDig: false,
      data: [],
      columns: [
        {
          name: "orgId",
          label: "组织id",
          align: "left",
          field: "org",
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
          label: "姓名",
          align: "left",
          field: "nickname",
          sortable: true
        },
        {
          name: "email",
          label: "邮箱",
          align: "left",
          field: "email",
          sortable: true
        },
        {
          name: "password",
          label: "密码",
          align: "left",
          field: "password"
        },
        {
          name: "qq",
          label: "QQ",
          align: "left",
          field: "qq"
        },
        {
          name: "group",
          label: "加入群组",
          align: "left",
          field: "groups",
          sortable: true
        },
        {
          name: "avatar",
          label: "头像URL",
          align: "left",
          field: "avatar"
        }
      ],
      pagination: {
        rowsPerPage: 10
      },
      file: null
    };
  },
  methods: {
    async handleImportFromFile() {
      this.$q.loading.show({
        message: "导入中..."
      });
      const res = await importExcel(this.file);
      this.data = res[0].sheet;
      this.$q.loading.hide();
    },
    async handleConfirmCreate() {
      this.$q.loading.show({
        message: "创建中..."
      });
      const { data } = await createManyUser(this.data);
      this.$q.notify({
        type: "positive",
        message: "创建成功"
      });
      this.$q.loading.hide();
    }
  }
};
</script>
