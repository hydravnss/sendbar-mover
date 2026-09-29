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
    const y = st.enabled ? (Number(st.y) || 0) : 0;
    $("#sbm_val").text(Number(st.y) || 0);
    const f = document.getElementById("form_sheld");
    if (!f) return;
    f.style.removeProperty("bottom");
    f.style.removeProperty("margin-bottom");
    if (!y) return;
    // y negatif = monter. Si la barre est fixee en bas (position: fixed), on decale "bottom";
    // sinon on utilise la marge.
    if (getComputedStyle(f).position === "fixed") {
        f.style.setProperty("bottom", `${-y}px`, "important");
    } else {
        f.style.setProperty("margin-bottom", `${-y}px`, "important");
    }
}

jQuery(async () => {
    try {
        const html = await $.get(`${folder}/setting.html?v=1.1.0`);
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
    window.addEventListener("resize", apply);
    setTimeout(apply, 1500);
    console.log("[sendbar-mover] loaded");
});
