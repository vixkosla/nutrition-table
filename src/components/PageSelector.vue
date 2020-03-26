<template>
  <div class="selector">
    <div class="selector-top" v-on:click="toogle()">
      <div class="selector-top_text">{{ selected }} Per Page</div>
      <div class="selector-top_img">
        <img src="@/assets/icons/arrow-down.svg" />
      </div>
    </div>
    <div v-if="show" class="selector-bottom">
      <div
        v-for="(page, index) in pagination"
        v-bind:key="index"
        class="selector-bottom_element"
        v-on:click="select(index)"
      >
        {{ page.value }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    pagination: {
      type: Array,
      default() {
        return [
          {
            value: 10,
            selected: true
          }
        ];
      }
    }
  },
  data() {
    return {
      show: false
    };
  },
  computed: {
    selected() {
      return this.pagination.find(el => el.selected).value;
    }
  },
  methods: {
    toogle() {
      this.show = !this.show;
    },
    select(index) {
      // turn off other page options
      for (let page of this.pagination) {
        page.selected = false;
      }
      // selecte clicked page option
      this.pagination[index].selected = true;
      this.show = !this.show;
    }
  }
};
</script>

<style scoped lang="scss">
.selector {
  color: #5b5e77;

  &-top {
    display: flex;
    align-items: center;
    border: 1px solid #c6cbd4;
    border-radius: 2px;
    width: 109px;

    &_text {
      line-height: 24px;
      padding: 3px 0 3px 14px;
      // display: flex;
      // color: red;
    }

    &_img {
      display: flex;

      img {
        margin: 0 8px;
      }
    }
  }

  &-bottom {
    background-color: white;
    width: 35%;
    margin-top: 14px;
    box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.16);
    border-radius: 4px;
    position: absolute;

    &_element {
      line-height: 24px;
      padding: 4px;

      &:hover {
        background-color: #f2f2f2;
      }
    }
  }
}
</style>
