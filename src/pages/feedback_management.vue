<template>
  <q-page class="q-pa-sm">
    <q-table
      title="反馈列表"
      :data="data"
      :columns="columns"
      row-key="_id"
      :filter="filter"
      :pagination.sync="pagination"
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
          <q-btn outline color="primary" icon="message" label="反馈列表" />
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
            :icon="props.value === 'bug' ? 'report' : 'science'"
            :color="props.value === 'bug' ? 'negative' : 'primary'"
          >
            {{ props.value === "bug" ? "BUG反馈" : "功能建议" }}
          </q-chip>
        </q-td>
      </template>

      <template v-slot:body-cell-status="props">
        <q-td :props="props">
          <q-chip
            class="glossy"
            dense
            square
            :color="
              props.value === 'read'
                ? 'green'
                : props.value === 'accept'
                ? 'purple'
                : 'pink'
            "
            text-color="white"
          >
            {{
              props.value === "read"
                ? "已读"
                : props.value === "accept"
                ? "已采纳"
                : "待处理"
            }}
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
              flat
              dense
              size="sm"
              color="primary"
              icon="find_in_page"
              @click.stop="onClickViewFeedback(props.row)"
              ><q-tooltip>
                查看
              </q-tooltip></q-btn
            >
            <q-btn
              flat
              dense
              size="sm"
              color="red"
              icon="clear"
              @click.stop="onClickDeleteFeedback(props.row)"
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
    <q-dialog v-model="feedbackDetailDig" persistent>
      <q-card class="col-md-10 col-12">
        <q-card-section>
          <div class="row">
            <q-chip
              class="glossy"
              outline
              square
              size="md"
              :icon="currFeedback.type === 'bug' ? 'report' : 'science'"
              :label="currFeedback.title"
            />
          </div>
          <div class="row">
            <q-chip square dense outline>
              <q-avatar size="xs">
                <img :src="currFeedback.creator.avatar" />
              </q-avatar>
              {{ currFeedback.creator.nickname }}
            </q-chip>
            <q-chip
              class="glossy"
              dense
              square
              :color="
                currFeedback.status === 'read'
                  ? 'green'
                  : currFeedback.status === 'accept'
                  ? 'purple'
                  : 'pink'
              "
              text-color="white"
            >
              {{
                currFeedback.status === "read"
                  ? "已读"
                  : currFeedback.status === "accept"
                  ? "已采纳"
                  : "待处理"
              }}
            </q-chip>
            <q-chip
              v-if="currFeedback.needreply"
              dense
              square
              outline
              color="deep-purple"
              icon="rss_feed"
              label="希望收到答复"
            />
          </div>
        </q-card-section>
        <q-separator spaced inset />
        <q-card-section>
          <div class="q-px-xs">{{ currFeedback.description }}</div>
        </q-card-section>
        <q-separator spaced inset />
        <q-card-section class="q-gutter-x-md">
          <q-btn
            flat
            dense
            color="positive"
            icon="book"
            label="设为已读"
            @click="onClickSetFeedbackStauts('read')"
          />
          <q-btn
            flat
            dense
            color="purple"
            icon="thumb_up_alt"
            label="设为已采纳"
            @click="onClickSetFeedbackStauts('accept')"
          />
          <q-btn
            flat
            dense
            color="red"
            icon="delete"
            label="删除"
            @click="onClickDeleteFeedback(currFeedback)"
          />
          <q-btn
            color="grey"
            flat
            dense
            icon="close"
            label="关闭"
            @click="feedbackDetailDig = false"
          />
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import {
  getFeedbackList,
  getFeedbackDetail,
  updateFeedback,
  deleteFeedback
} from "src/api/feedback";
import { date } from "quasar";

export default {
  data() {
    return {
      filter: "",
      feedbackDetailDig: false,
      currFeedback: {
        creator: {}
      },
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
          name: "creator",
          label: "提供者",
          align: "left",
          field: "creator",
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
      const { data } = await getFeedbackList();
      this.data = data;
      this.$q.loading.hide();
    },
    async onClickViewFeedback(feedback) {
      const { data } = await getFeedbackDetail(feedback._id);
      this.currFeedback = data;
      this.feedbackDetailDig = true;
    },
    async onClickSetFeedbackStauts(status) {
      await updateFeedback(this.currFeedback._id, { status });
      this.$q.notify({
        type: "positive",
        message: `设置成功`
      });
      this.fetch()
    },
    async onClickDeleteFeedback(feedback) {
      this.$q
        .dialog({
          title: "请确认",
          message: `删除反馈《${feedback.title}》，操作不可恢复！`,
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
          await deleteFeedback(feedback._id);
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
  }
};
</script>
