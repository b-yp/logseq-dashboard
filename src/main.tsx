import "@logseq/libs";
import React from "react";
import * as ReactDOM from "react-dom/client";

import App from "./App";
import { logseq as PL } from "../package.json";

import "./index.css";
import "./style.scss"

const css = (t, ...args) => String.raw(t, ...args);

const pluginId = PL.id;

function main() {
  console.info(`#${pluginId}: MAIN`);
  const root = ReactDOM.createRoot(document.getElementById("app")!);

  root.render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );

  // TODO: 用来实时统计字数的，由于性能问题，暂时注释掉
  // logseq.DB.onChanged(async (res) => {
  //   if (res.blocks.length !== 1 || !res.blocks[0].content) {
  //     return
  //   }

  //   const count = countOutline(res.blocks[0].content)

  //   logseq.provideUI({
  //     key: "dashboard-bottom-bar",
  //     path: "#app-container",
  //     template: `
  //     <div
  //       class="dashboard-bottom-bar"
  //       style="
  //         width: 100vw;
  //         height: 30px;
  //         padding: 0 65px;
  //         position: fixed;
  //         left: 0;
  //         right: 0;
  //         bottom: 0;
  //         display: flex;
  //         align-items: center;
  //         justify-content: flex-end;
  //         background-color: rgba(51, 57, 65, 0.8);
  //       "
  //     >
  //       字数: ${count} 
  //     </div>
  //   `,
  //   })
  // })

  function createModel() {
    return {
      show() {
        logseq.showMainUI();
      },
    };
  }

  logseq.provideModel(createModel());
  logseq.setMainUIInlineStyle({
    zIndex: 11,
  });

  const openIconName = "template-plugin-open";

  logseq.provideStyle(css`
    .${openIconName} {
      opacity: 0.55;
      font-size: 20px;
      margin-top: 4px;
    }

    .${openIconName}:hover {
      opacity: 0.9;
    }
  `);

  logseq.App.registerUIItem("toolbar", {
    key: openIconName,
    template: `
      <div data-on-click="show" class="${openIconName}">⚙️</div>
    `,
  });
}

logseq.ready(main).catch(console.error);
