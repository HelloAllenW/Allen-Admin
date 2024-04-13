<template>
  <vxe-toolbar>
    <template #buttons>
      <vxe-button style="margin-left: 20px" @click="toggleSlot()">自定义插槽</vxe-button>
      <vxe-button @click="toggleToolbar()">开启/关闭toolbar</vxe-button>
      <vxe-button @click="toggleExpendRow()">开启/关闭展开行</vxe-button>
      <vxe-button @click="toggleEdit()">开启/关闭编辑功能</vxe-button>
    </template>
  </vxe-toolbar>
  <div class="card vxe-table-box">
    <vxe-toolbar v-if="showToolbar" custom print ref="toolbarRef" :buttons="toolbarButtons" :refresh="{ query: findList }">
    </vxe-toolbar>
    <!-- 编辑cell：:edit-config="{ mode: 'cell', trigger: 'click' }" -->
    <!-- header-cell-menu/cell-menu/menu-click：右键菜单 -->
    <vxe-table
      :edit-config="showEdit ? { mode: 'cell', trigger: 'click' } : {}"
      stripe
      ref="tableRef"
      align="left"
      border
      round
      size="medium"
      :height="showToolbar ? '73%' : '89%'"
      :data="tableData"
      :menu-config="menuConfig"
      :loading="loading"
      @header-cell-menu="headerCellContextMenuEvent"
      @cell-menu="cellContextMenuEvent"
      @menu-click="contextMenuClickEvent"
      @custom="toolbarCustomEvent"
    >
      <vxe-column type="seq" width="100"></vxe-column>
      <vxe-column field="name" title="姓名" width="100">
        <template v-if="showSlot" #default="{ row }">
          <vxe-button type="text" status="primary" @click="openDetail(row)">{{ row.name }}</vxe-button>
        </template>
      </vxe-column>
      <vxe-column v-if="showExpendRow" type="expand" title="联系人" width="80">
        <template #content="{ row }">
          <vxe-table border :data="row.contact">
            <vxe-column field="name" title="姓名"></vxe-column>
            <vxe-column field="email" title="电子邮件"></vxe-column>
          </vxe-table>
        </template>
      </vxe-column>
      <vxe-column field="sex" title="性别" :edit-render="{}" width="100">
        <template #edit="{ row }">
          <vxe-select v-model="row.sex" :options="sexOptions" transfer></vxe-select>
        </template>
        <template #default="{ row }">
          <span>{{ formatSex(row) }}</span>
        </template>
      </vxe-column>
      <vxe-column field="age" title="年龄" width="100"></vxe-column>
      <vxe-column field="idNo" title="身份证号" width="100"></vxe-column>
      <vxe-column field="email" title="电子邮件" width="100"></vxe-column>
      <vxe-column field="address" title="详细住址（家庭住址或者公司住址）" min-width="200" show-overflow="title"></vxe-column>
      <vxe-column
        min-width="200"
        field="signature"
        title="个性签名（非常有个性的签名）"
        show-header-overflow="title"
        show-overflow="title"
        show-footer-overflow
      ></vxe-column>
    </vxe-table>
  </div>
</template>

<script setup lang="ts" name="complexVXETable">
import { ref, reactive, nextTick } from "vue";
import { ElNotification } from "element-plus";
import {
  VXETable,
  VxeTablePropTypes,
  VxeTableEvents,
  VxeTableInstance,
  VxeToolbarPropTypes,
  VxeToolbarInstance
} from "vxe-table";

interface RowVO {
  id: number;
  name: string;
  sex: string;
  age: number;
  idNo: string;
  address: string;
  email: string;
  signature: string;
  contact: {
    name: string;
    email: string;
  }[];
}

const tableData = ref<RowVO[]>([
  {
    id: 10001,
    name: "杜静",
    sex: "0",
    age: 28,
    idNo: "186424293171036448",
    address: "云南省 普洱市",
    email: "p.dzplnulx@crev.de",
    signature: "想成为那种不声不响，但是什么都做得很好的人。",
    contact: [
      {
        name: "郭刚",
        email: "n.lpc@mighwyra.pw"
      },
      {
        name: "雷洋",
        email: "e.xzluc@qprbswgb.st"
      }
    ]
  },
  {
    id: 10002,
    name: "郭刚",
    sex: "1",
    age: 22,
    idNo: "312728497861447544",
    address: "河南省 漯河市",
    email: "n.lpc@mighwyra.pw",
    signature: "优秀却不带优越感，明亮又不刺眼，自信又懂得收敛。",
    contact: [
      {
        name: "徐君",
        email: "e.pkdjaq@efdftmuk.ht"
      },
      {
        name: "雷洋",
        email: "e.xzluc@qprbswgb.st"
      }
    ]
  },
  {
    id: 10003,
    name: "雷洋",
    sex: "0",
    age: 32,
    idNo: "451374142590358280",
    address: "内蒙古自治区 巴彦淖尔市",
    email: "e.xzluc@qprbswgb.st",
    signature: "不去预知明天的烦恼，爱眼下具体的生活。",
    contact: [
      {
        name: "郭刚",
        email: "n.lpc@mighwyra.pw"
      },
      {
        name: "雷洋",
        email: "e.xzluc@qprbswgb.st"
      }
    ]
  },
  {
    id: 10004,
    name: "徐君",
    sex: "0",
    age: 24,
    idNo: "122448606327173478",
    address: "新疆维吾尔自治区 乌鲁木齐市",
    email: "e.pkdjaq@efdftmuk.ht",
    signature: "自信到可以成为自己的光。",
    contact: [
      {
        name: "郭刚",
        email: "n.lpc@mighwyra.pw"
      },
      {
        name: "雷洋",
        email: "e.xzluc@qprbswgb.st"
      }
    ]
  },
  {
    id: 10005,
    name: "沈明",
    sex: "0",
    age: 24,
    idNo: "130091846423506351",
    address: "江苏省 苏州市",
    email: "k.rstprb@hxuocmoz.gr",
    signature: "活在当下。",
    contact: [
      {
        name: "郭刚",
        email: "n.lpc@mighwyra.pw"
      },
      {
        name: "雷洋",
        email: "e.xzluc@qprbswgb.st"
      }
    ]
  },
  {
    id: 10006,
    name: "曾杰",
    sex: "1",
    age: 24,
    idNo: "266626183872461563",
    address: "香港特别行政区 九龙",
    email: "i.zllc@bse.cy",
    signature: "拐个弯，与生活和解，得失都随意。",
    contact: [
      {
        name: "郭刚",
        email: "n.lpc@mighwyra.pw"
      },
      {
        name: "雷洋",
        email: "e.xzluc@qprbswgb.st"
      }
    ]
  }
]);

// 编辑功能
const showEdit = ref(true);
const toggleEdit = () => {
  showEdit.value = !showEdit.value;
  ElNotification({
    title: "",
    message: showEdit.value ? "开启编辑成功，请点击性别中的某一cell" : "关闭编辑",
    type: "success"
  });
};

const sexOptions = ref([
  { label: "男", value: "1" },
  { label: "女", value: "0" }
]);

const formatSex = (row: RowVO) => {
  return row.sex === "1" ? "男" : "女";
};

// 按钮组
const toolbarButtons = ref<VxeToolbarPropTypes.Buttons>([
  { code: "btn1", name: "新增" },
  {
    name: "下拉按钮",
    dropdowns: [
      { name: "按钮111", code: "btn2" },
      { name: "按钮222", code: "btn3" }
    ]
  }
]);
// 刷新
const loading = ref(false);
const findList = () => {
  loading.value = true;
  return new Promise(resolve => {
    setTimeout(() => {
      loading.value = false;
      resolve([]);
    }, 300);
  });
};
const toolbarCustomEvent: VxeTableEvents.Custom<RowVO> = params => {
  const $table = tableRef.value;
  if ($table) {
    const visibleColumn = $table.getColumns();
    switch (params.type) {
      case "confirm": {
        VXETable.modal.message({ content: `点击了确认，显示为 ${visibleColumn.length} 列`, status: "info" });
        break;
      }
      case "reset": {
        VXETable.modal.message({ content: `点击了重置，显示为 ${visibleColumn.length} 列`, status: "info" });
        break;
      }
      case "close": {
        VXETable.modal.message({ content: `关闭了面板，显示为 ${visibleColumn.length} 列`, status: "info" });
        break;
      }
    }
  }
};
// 将表格和工具栏进行关联
const tableRef = ref<VxeTableInstance<RowVO>>();
const toolbarRef = ref<VxeToolbarInstance>();
nextTick(() => {
  const $table = tableRef.value;
  const $toolbar = toolbarRef.value;
  if ($table && $toolbar) {
    $table.connect($toolbar);
  }
});

// 自定义插槽
const showSlot = ref(false);
const toggleSlot = () => {
  showSlot.value = !showSlot.value;
  ElNotification({
    title: "",
    message: showSlot.value ? "开启插槽" : "关闭插槽",
    type: "success"
  });
};
const openDetail = (row: RowVO) => {
  VXETable.modal.message({
    status: "success",
    content: `点击了${row.name}`
  });
};

// 展开行
const showExpendRow = ref(false);
const toggleExpendRow = () => {
  showExpendRow.value = !showExpendRow.value;
  ElNotification({
    title: "",
    message: showExpendRow.value ? "开启展开行" : "关闭展开行",
    type: "success"
  });
};

// 右键菜单
const showToolbar = ref(false);
const toggleToolbar = () => {
  showToolbar.value = !showToolbar.value;
  ElNotification({
    title: "",
    message: showToolbar.value ? "开启右键菜单" : "关闭右键菜单",
    type: "success"
  });
};
let menuConfig = reactive<VxeTablePropTypes.MenuConfig<RowVO>>({
  header: {
    options: [[{ code: "exportAll", name: "导出所有.csv", visible: true, disabled: false }]]
  },
  body: {
    options: [
      [{ code: "details", name: "查看详情", prefixIcon: "vxe-icon-link", visible: true, disabled: false }],
      [
        { code: "copy", name: "复制", prefixIcon: "vxe-icon-copy", visible: true, disabled: false },
        { code: "clear", name: "清除内容", prefixIcon: "vxe-icon-delete-fill", visible: true, disabled: false }
      ],
      [
        { code: "remove", name: "删除", visible: true, disabled: false },
        {
          code: "filter",
          name: "筛选",
          visible: true,
          disabled: false,
          children: [
            { code: "clearFilter", name: "清除筛选", visible: true, disabled: false },
            { code: "filterSelect", name: "按所选单元格的值筛选", visible: true, disabled: false }
          ]
        },
        {
          code: "sort",
          name: "排序",
          visible: true,
          disabled: false,
          children: [
            { code: "clearSort", name: "清除排序", visible: true, disabled: false },
            { code: "sortAsc", name: "升序", visible: true, disabled: false },
            { code: "sortDesc", name: "倒序", visible: true, disabled: false }
          ]
        },
        { code: "print", name: "打印", disabled: true }
      ]
    ]
  },
  footer: {
    options: [[{ code: "clearAll", name: "清空数据", visible: true, disabled: false }]]
  },
  visibleMethod({ options, column }) {
    // 示例：只有 name 列允许操作，清除按钮只能在 age 才显示
    // 显示之前处理按钮的操作权限
    const isDisabled = !column || column.field !== "name";
    const isVisible = column && column.field === "age";
    options.forEach(list => {
      list.forEach(item => {
        item.disabled = false;
        if (column) {
          if (item.code === "copy" || item.code === "remove") {
            item.disabled = isDisabled;
          }
          if (item.code === "details") {
            item.visible = column.field === "name";
          } else if (item.code === "clear" || item.code === "filter") {
            item.visible = isVisible;
          }
        } else {
          item.disabled = true;
        }
        if (item.children) {
          item.children.forEach(childItem => {
            childItem.disabled = item.disabled;
          });
        }
      });
    });
    return true;
  }
});
const headerCellContextMenuEvent: VxeTableEvents.HeaderCellMenu<RowVO> = ({ column }) => {
  const $table = tableRef.value;
  if ($table) {
    $table.setCurrentColumn(column);
  }
};
const cellContextMenuEvent: VxeTableEvents.CellMenu<RowVO> = ({ row }) => {
  const $table = tableRef.value;
  if ($table) {
    $table.setCurrentRow(row);
  }
};
const contextMenuClickEvent: VxeTableEvents.MenuClick<RowVO> = ({ menu }) => {
  VXETable.modal.message({ content: `点击了 "${menu.name}"`, status: "info" });
};
</script>

<style scoped lang="scss">
// 全局样式调整
.vxe-toolbar {
  margin-bottom: 10px;
  border-radius: 6px;
}
.vxe-table-box {
  height: calc(100% - 70px);
}
</style>
