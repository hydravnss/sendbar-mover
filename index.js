import { extension_settings } from "../../../extensions.js";
import { saveSettingsDebounced } from "../../../../script.js";

const name = "sendbar-mover";
const folder = `scripts/extensions/third-party/${name}`;

function s() {
    extension_settings[name] = extension_settings[name] || {};
    const st = extension_settings[name];
    if (st.enabled === undefined) st.enabled = true;
    if (st.y === undefined) st.y = 0;
    return st;
}

function apply() {
    const st = s();
    const v = st.enabled ? `${Number(st.y) || 0}px` : "0px";
    document.documentElement.style.setProperty("--sbm-y", v);
    document.body.style.setProperty("--sbm-y", v);
    const f = document.getElementById("form_sheld");
    if (f) f.style.setProperty("--sbm-y", v);
    $("#sbm_val").text(Number(st.y) || 0);
}

jQuery(async () => {
    try {
        const html = await $.get(`${folder}/setting.html?v=1.0.1`);
        $("#extensions_settings2").append(html);
    } catch (e) {
        console.warn("[sendbar-mover] setting.html error", e);
    }
    const st = s();
    $("#sbm_enabled").prop("checked", st.enabled).on("change", function () {
        st.enabled = $(this).is(":checked");
        saveSettingsDebounced();
        apply();
    });
    $("#sbm_y").val(st.y).on("input change", function () {
        st.y = Number($(this).val());
        saveSettingsDebounced();
        apply();
    });
    $("#sbm_reset").on("click", () => {
        st.y = 0;
        $("#sbm_y").val(0);
        saveSettingsDebounced();
        apply();
    });
    apply();
    console.log("[sendbar-mover] loaded");
});
