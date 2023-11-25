<script>
import { h, defineComponent, computed, ref } from "vue";

export default defineComponent({
  props: {
    message: String,
  },
  setup(props) {
    const { message } = props;
    let tag = "div";
    let videoId;
    const patternLink = /^(http|https|www)/;
    const patternBlob = /^blob:http/;
    const patternYoutubeVideo =
      /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)/;

    if (patternBlob.test(message)) {
      tag = "img";
    } else if (patternYoutubeVideo.test(message)) {
      const searcheUrl = new URLSearchParams(message.split("?")[1]);
      videoId = searcheUrl.get("v");
      tag = "iframe";
    } else if (patternLink.test(message)) {
      tag = "a";
    }

    const selectedTag = {
      img: {
        src: message,
        class: "v-component_messageImage",
      },
      a: {
        href: message,
        target: "_blank",
      },
      iframe: {
        width: "480",
        height: "360",
        src: `https://www.youtube.com/embed/${videoId}`,
        frameborder: "0",
        allowfullscreen: true,
      },
      div: {
        class: "v-component_textMessage",
      },
    };

    const attribute = computed(() => ({
      ...selectedTag[tag],
    }));

    return () => h(tag, attribute.value, tag !== "img" && message);
  },
});
</script>
<style lang="scss">
.v-component_messageImage {
  max-width: 100%;
}

.v-component_textMessage {
}
</style>
