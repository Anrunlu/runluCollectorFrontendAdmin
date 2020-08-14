<template>
  <div>
    <q-table
      title="组织管理"
      :data="data"
      :columns="columns"
      row-key="_id"
      :filter="filter"
      :pagination.sync="pagination"
    >
      <template v-slot:top-left>
        <div class="q-gutter-sm">
          <q-btn outline color="primary" icon="school" label="组织管理" />
          <q-btn
            outline
            color="positive"
            icon="add"
            label="添加组织"
            @click="handleAddOrg"
          />
        </div>
      </template>

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

      <template v-slot:body-cell-orgname="props">
        <q-td :props="props">
          <q-chip dense outline icon="school" color="primary">
            {{ props.value }}
          </q-chip>
        </q-td>
      </template>

      <template v-slot:body-cell-createdAt="props">
        <q-td :props="props">
          <q-chip dense square outline icon="insert_invitation" color="primary">
            {{ props.value }}
          </q-chip>
        </q-td>
      </template>

      <template v-slot:body-cell-numOfUsers="props">
        <q-td :props="props">
          <q-chip dense square outline icon="person" color="accent">
            {{ props.value }}
          </q-chip>
        </q-td>
      </template>

      <template v-slot:body-cell-numOfGroups="props">
        <q-td :props="props">
          <q-chip dense square outline icon="people" color="positive">
            {{ props.value }}
          </q-chip>
        </q-td>
      </template>

      <template v-slot:body-cell-numOfClts="props">
        <q-td :props="props">
          <q-chip dense square outline icon="topic" color="info">
            {{ props.value }}
          </q-chip>
        </q-td>
      </template>

      <template v-slot:body-cell-numOfPosts="props">
        <q-td :props="props">
          <q-chip dense square outline icon="description" color="primary">
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
              @click="handleCurrOrgDetail(props.row)"
              ><q-tooltip>
                修改信息
              </q-tooltip></q-btn
            >
            <q-btn
              flat
              dense
              size="sm"
              color="red"
              icon="delete_outline"
              @click="handleDeleteOrg(props.row)"
            >
              <q-tooltip>
                删除组织
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
    <q-dialog v-model="OrgDetailDig">
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
          <div class="text-h6">组织详情</div>
          <div class="text-subtitle2">查看或编辑组织信息</div>
        </q-card-section>
        <q-card-section class="q-pa-sm">
          <q-list class="row">
            <q-item class="col-12">
              <q-item-section>
                <q-input
                  filled
                  color="black"
                  v-model="currOrgDetails._id"
                  label="ID"
                  disable
                />
              </q-item-section>
            </q-item>
            <q-item class="col-12">
              <q-item-section>
                <q-input
                  filled
                  color="black"
                  v-model="currOrgDetails.name"
                  label="组织名"
                />
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn
            class="text-capitalize bg-info text-black"
            @click="handleUpdateOrgInfo"
            >保存</q-btn
          >
        </q-card-actions>
      </q-card>
    </q-dialog>
    <q-dialog v-model="addOrgDig">
      <q-card class="card-bg text-black" style="width:400px">
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
          <div class="text-h6">新建组织</div>
        </q-card-section>
        <q-card-section class="q-pa-sm">
          <q-list class="row">
            <q-item class="col-12">
              <q-item-section>
                <q-input
                  filled
                  color="black"
                  v-model="newOrg.name"
                  label="名称"
                />
              </q-item-section>
            </q-item>
          </q-list>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn class="text-capitalize bg-info text-black" @click="addOrg"
            >保存</q-btn
          >
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script>
import { updateOrg, deleteOrg, createOrg } from "src/api/org";
import { exportFile, date } from "quasar";
function wrapCsvValue(val, formatFn) {
  let formatted = formatFn !== void 0 ? formatFn(val) : val;

  formatted =
    formatted === void 0 || formatted === null ? "" : String(formatted);

  formatted = formatted.split('"').join('""');

  return `"${formatted}"`;
}
export default {
  name: "OrgsTable",
  props: ["data"],
  data() {
    return {
      filter: "",
      OrgDetailDig: false,
      addOrgDig: false,
      newOrg: {},
      currOrgDetails: {
        creator: {}
      },
      columns: [
        {
          name: "orgname",
          label: "组织名",
          align: "left",
          field: row => row.name,
          sortable: true
        },
        {
          name: "createdAt",
          label: "创建时间",
          align: "left",
          field: "createdAt",
          format: (val, row) => date.formatDate(val, "MM/DD HH:mm"),
          sortable: true
        },
        {
          name: "numOfUsers",
          label: "用户数量",
          align: "left",
          field: 'numOfUsers',
          sortable: true
        },
        {
          name: "numOfGroups",
          label: "群组数量",
          align: "left",
          field: 'numOfGroups',
          sortable: true
        },
        {
          name: "numOfClts",
          label: "收集数量",
          align: "left",
          field: 'numOfClts',
          sortable: true
        },
        {
          name: "numOfPosts",
          label: "文件数量",
          align: "left",
          field: 'numOfPosts',
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

      const status = exportFile("organization.csv", content, "text/csv");

      if (status !== true) {
        this.$q.notify({
          message: "Browser denied file download...",
          color: "negative",
          icon: "warning"
        });
      }
    },
    async handleUpdateOrgInfo() {
      let updateOrgDto = {};
      updateOrgDto.name = this.currOrgDetails.name;
      await updateOrg(this.currOrgDetails._id, updateOrgDto);
      this.$q.notify({
        type: "positive",
        message: "更新成功"
      });
    },
    async handleDeleteOrg(org) {
      this.$q
        .dialog({
          title: "请确认",
          message: `删除组织 ${org.name}，操作不可恢复！`,
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
          await deleteOrg(org._id);
          // 删除本地数据
          this.data.splice(
            this.data.findIndex(item => item._id === org._id),
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
    async addOrg() {
      await createOrg(this.newOrg);
      this.$emit("fetch");
      this.addOrgDig = false;
      this.$q.notify({
        message: "添加成功",
        color: "positive",
        icon: "done",
        position: "center",
        timeout: 1000
      });
    },
    handleCurrOrgDetail(val) {
      this.OrgDetailDig = true;
      this.currOrgDetails = val;
    },
    handleAddOrg() {
      this.addOrgDig = true;
    }
  }
};
</script>
