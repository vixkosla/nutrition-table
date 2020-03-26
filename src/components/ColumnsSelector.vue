<template>
  <div class="selector">
    <div class="selector-top" v-on:click="toogle()">
      <div class="selector-top_text">{{ columnsNumber }}</div>
      <div class="selector-top_img">
        <img src="@/assets/icons/arrow-down.svg" />
      </div>
    </div>
    <div v-if="show" class="selector-bottom">
      <div class="selector-element " v-on:click="toogleAll()">
        <div class="element-checkbox">
          <img v-show="selectAll" src="@/assets/icons/checkbox-done.svg" />
          <img v-show="!selectAll" src="@/assets/icons/checkbox.svg" />
        </div>
        <div class="element-textbox_all">Select All</div>
      </div>

      <div
        v-for="(column, index) in columns"
        v-bind:key="index"
        class="selector-element"
        v-on:click="toogleProperty(index)"
      >
        <div class="element-checkbox">
          <img v-show="column.visible" src="@/assets/icons/checkbox-done.svg" />
          <img v-show="!column.visible" src="@/assets/icons/checkbox.svg" />
        </div>
        <div class="element-textbox">
          {{ column.name }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    columns: {
      type: Array,
      default() {
        return [
          {
            name: "column",
            visible: false
          }
        ];
      }
    }
  },
  data() {
    return {
      name: "value",
      show: false
      // selectAll: false
    };
  },
  // watch:
  computed: {
    columnsNumber() {
      let count = this.columns.filter(el => el.visible).length;
      return (
        count +
        " column" +
        (count > 1 ? "s" : "") +
        (count === 0 ? "s" : "") +
        " selected"
      );
    },
    selectAll() {
      return !this.columns.filter(el => !el.visible).length;
    }
  },
  methods: {
    toogle() {
      this.show = !this.show;
    },
    toogleAll() {
      let temp;

      if (this.selectAll) {
        temp = false;
      } else if (!this.selectAll) {
        temp = true;
      }
      this.columns.forEach(el => {
        el.visible = temp;
        el.sort = false;
      });
    },
    toogleProperty(index) {
      this.$parent.toogleProperty(index);
    }
  }
};
</script>

<style scoped lang="scss">
.selector {
  cursor: pointer;
  font-size: 14px;
  font-family: "Source Sans Pro";
  font-weight: normal;

  &-top {
    border: 1px solid #d5dae0;
    border-radius: 2px;
    display: flex;
    padding: 3px 0 3px 20px;
    line-height: 24px;
    color: #5b5e77;
    width: 137px;
    // box-sizing: border-box;

    &_img {
      display: flex;
      & > img {
        margin: 0 10px 0 6px;
      }
    }
  }

  &-bottom {
    width: 207px;
    height: 243px;
    box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.16);
    border-radius: 4px;
    position: absolute;
    margin-top: 14px;
    z-index: 3;
    overflow-y: scroll;
    overflow-x: hidden;
    padding: 4px 0;
    background-color: white;

    &::-webkit-scrollbar {
      width: 4px;
    }

    &::-webkit-scrollbar-thumb {
      background-color: #d5dae0;
      border-radius: 4px;
    }
    // scrollbar top and bottom
    // &::-webkit-scrollbar-thumb {
    //   padding-top: 10px;
    // }
  }
  &-element {
    padding: 6px 12px;
    display: flex;
    height: 24px;

    &:hover {
      background-color: #f2f2f2;
    }
  }
}

.element-checkbox {
  display: inline-block;
}

.element-checkbox img {
  &:first-child {
    margin: 5px;
  }
}

%placeholder-element-textbox {
  padding-left: 8px;
  line-height: 24px;
}

.element-textbox {
  @extend %placeholder-element-textbox;

  &_all {
    @extend %placeholder-element-textbox;
    font-weight: 600;
  }
}
</style>
