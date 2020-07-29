<template>
  <q-page class="q-pa-sm">
    <q-table
      title="公告列表"
      :data="data"
      :columns="columns"
      row-key="_id"
      :filter="filter"
      :pagination.sync="pagination"
      @row-dblclick="onClickRow"
    >
      <template v-slot:top-right>
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
        <q-btn flat round dense icon="refresh" @click="fetch">
          <q-tooltip v-close-popup>刷新</q-tooltip>
        </q-btn>
      </template>

      <template v-slot:top-left>
        <div class="q-gutter-sm">
          <q-btn outline color="primary" icon="assignment" label="公告列表" />
          <q-btn
            outline
            color="positive"
            icon="add"
            label="新建公告"
            @click="onClickNewNotice"
          />
        </div>
      </template>

      <template v-slot:body-cell-title="props">
        <q-td :props="props">
          <q-chip dense square outline icon="article" color="black">
            {{ props.value }}
          </q-chip>
        </q-td>
      </template>

      <template v-slot:body-cell-type="props">
        <q-td :props="props">
          <q-chip
            class="glossy"
            dense
            square
            outline
            :icon="
              props.value === 'announcement'
                ? 'assignment'
                : props.value === 'notice'
                ? 'notifications_none'
                : props.value === 'ad'
                ? 'forum'
                : 'dehaze'
            "
            color="primary"
            text-color="white"
          >
            {{
              props.value === "announcement"
                ? "公告"
                : props.value === "notice"
                ? "消息"
                : props.value === "ad"
                ? "广告"
                : "其他"
            }}
          </q-chip>
        </q-td>
      </template>

      <template v-slot:body-cell-status="props">
        <q-td :props="props">
          <q-chip
            class="glossy"
            dense
            square
            :icon="props.value === '草稿' ? 'history_edu' : 'campaign'"
            :color="props.value === '草稿' ? 'pink' : 'green'"
            text-color="white"
          >
            {{ props.value }}
          </q-chip>
        </q-td>
      </template>

      <template v-slot:body-cell-receiver="props">
        <q-td :props="props">
          <q-chip
            v-if="props.row.status === 'published'"
            class="glossy"
            icon="rss_feed"
            dense
            square
            color="purple"
            text-color="white"
          >
            {{ props.value.name ? props.value.name : props.value.nickname }}
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

      <template v-slot:body-cell-creator="props">
        <q-td :props="props">
          <q-chip square dense outline>
            <q-avatar size="xs">
              <img :src="props.value.avatar" />
            </q-avatar>
            {{ props.value.nickname }}
          </q-chip>
        </q-td>
      </template>

      <template v-slot:body-cell-action="props">
        <q-td :props="props">
          <div class="q-gutter-sm">
            <q-btn
              v-if="props.row.status === 'published'"
              flat
              dense
              size="sm"
              color="primary"
              icon="undo"
              @click.stop="onClickUnpublishNotice(props.row)"
              ><q-tooltip>
                取消发布
              </q-tooltip></q-btn
            >
            <q-btn
              flat
              dense
              size="sm"
              color="primary"
              icon="edit"
              @click.stop="onClickEditNotice(props.row)"
              ><q-tooltip>
                修改
              </q-tooltip></q-btn
            >
            <q-btn
              flat
              dense
              size="sm"
              color="red"
              icon="clear"
              @click.stop="onClickDeleteNotice(props.row)"
            >
              <q-tooltip>
                删除
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

  </q-page>
</template>

<script>
import { getNoticeList, updateNotice, deleteNotice } from "src/api/notice";
import { date } from "quasar";

export default {
  data() {
    return {
      filter: "",
      data: [],
      columns: [
        {
          name: "title",
          label: "标题",
          align: "left",
          field: "title",
          sortable: true
        },
        {
          name: "type",
          label: "类型",
          align: "left",
          field: "type",
          sortable: true
        },
        {
          name: "status",
          label: "状态",
          align: "left",
          field: "status",
          format: val => (val === "draft" ? "草稿" : "已发布"),
          sortable: true
        },
        {
          name: "receiver",
          label: "接收者",
          align: "left",
          field: "receiver",
          sortable: true
        },
        {
          name: "createdAt",
          label: "创建时间",
          align: "left",
          field: "createdAt",
          format: val => date.formatDate(val, "MM/DD HH:mm"),
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
  created() {
    this.fetch();
  },
  methods: {
    async fetch() {
      this.$q.loading.show({
        message: "加载中..."
      });
      const { data } = await getNoticeList();
      this.data = data;
      this.$q.loading.hide();
    },
    onClickNewNotice() {
      this.$router.push(`/edit_notice/new`);
    },
    onClickEditNotice(notice) {
      this.$router.push(`/edit_notice/${notice._id}`);
    },
    async onClickUnpublishNotice(notice) {
      notice.status = "draft";
      await updateNotice(notice._id, { status: "draft" });
      this.$q.notify({
        type: "positive",
        message: "取消发布成功"
      });
    },
    async onClickDeleteNotice(notice) {
      this.$q
        .dialog({
          title: "请确认",
          message: `删除公告《${notice.title}》，操作不可恢复！`,
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
          await deleteNotice(notice._id);
          this.fetch();
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
    onClickRow(evt, row) {
      this.$router.push(`/edit_notice/${row._id}`);
    }
  }
};
</script>
