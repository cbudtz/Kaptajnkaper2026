/*
    Adapted from Privateer (GPL-3.0) for Phaser hosting.
    Original: https://github.com/nivs1978/Privateer
    Based on Kaptajn Kaper i Kattegat (Peter Ole Frederiksen, GPL-3.0)
    https://github.com/kb-dk/KaptajnKaper
*/

String.prototype.format = String.prototype.format ||
function () {
    "use strict";
    var str = this.toString();
    if (arguments.length) {
        var t = typeof arguments[0];
        var key;
        var args = ("string" === t || "number" === t) ?
            Array.prototype.slice.call(arguments)
            : arguments[0];

        for (key in args) {
            str = str.replace(new RegExp("\\{" + key + "\\}", "gi"), args[key]);
        }
    }

    return str;
};

function lzHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function getColor(r,g,b)
{
    return "#" + lzHex(r) + lzHex(g) + lzHex(b);
}

var qbasicPlayer = new PlayStringPlayer();

var qbasicPlayStrings = {
    intro: "T230L8MBMSCO3BO4C4O3CP8C4GFEGO4CP8CEDCD4O3D4D4O4D CO3BDGDG4ABO4C32D32C16O3BAGA32B32A16GFEF32G32F16EDCDCO2BAGO3CO2BO3DCEDFE16F16EC4C4",
    taps: "T180MBO2L4G.G8O3C1P4O2G.O3C8E1P4O2G.O3C8E2O2G.O3C8E2O2G.O3C8E1P2C.O3E8G1.O2G.G8O3C1",
    flute1: "MBT200L16O3CEGO4C..O3GO4C4",
    b5th: "MBT200O2L8GGGE-2.P8FFFD2.",
    beep: "T255O4L64C",
    flee: "T255O5L32GFEDCBO4AGFEDC"
};

/** Mirrors DOS LYD: -1 = effects on, 0 = silence (see KAPER.BAS). */
var gameSoundEnabled = true;

function ensureQbasicAudioUnlocked()
{
    qbasicPlayer.ensureAudio().catch(function () {});
}

function setGameSoundEnabled(enabled)
{
    gameSoundEnabled = !!enabled;
}

function toggleGameSound()
{
    gameSoundEnabled = !gameSoundEnabled;
    return gameSoundEnabled;
}

function isGameSoundEnabled()
{
    return gameSoundEnabled;
}

function playsound(name)
{
    if (!gameSoundEnabled)
        return;

    var playString = qbasicPlayStrings[name];
    if (!playString)
        return;

    qbasicPlayer.ensureAudio().then(function () {
        qbasicPlayer.play(playString);
    }).catch(function () {});
}

/** @type {HTMLImageElement|null} */
var img_ship_board_en = null;
var img_ship_board_da = null;
var img_flag_pole = null;
var img_flag_pirate = null;
var img_flag_en = null;
var img_fm1 = null;
var img_fm2 = null;
var img_ship_harbor = null;
var img_harbor_border_bottom = null;
var img_harbor_border = null;
var img_ship_map_mode2 = null;
var img_shoot_help = null;
var img_ship_map_mode1 = null;
var img_title_da = null;
var img_title_en = null;
var img_shoot = null;
var img_shoot_wind = null;
var img_shoot_cross = null;
var img_shoot_hit = null;
var img_shoot_miss1 = null;
var img_map_mode2 = null;
var img_map_mode1 = null;

/**
 * Wire Phaser-loaded textures into globals used by the legacy renderer.
 * @param {import('phaser').Scene} scene
 */
function bindLegacyImages(scene)
{
    function src(key) {
        return scene.textures.get(key).getSourceImage();
    }

    img_ship_board_en = src('ship-board-en');
    img_ship_board_da = src('ship-board-da');
    img_flag_pole = src('flag-pole');
    img_flag_pirate = src('flag-pirate');
    img_flag_en = src('flag-en');
    img_fm1 = src('font-mode1');
    img_fm2 = src('font-mode2');
    img_ship_harbor = src('ship-harbor');
    img_harbor_border_bottom = src('harbor-border-bottom');
    img_harbor_border = src('harbor-border');
    img_ship_map_mode2 = src('ship-map-mode2');
    img_shoot_help = src('shoot-help');
    img_ship_map_mode1 = src('ship-map-mode1');
    img_title_da = src('title-da');
    img_title_en = src('title-en');
    img_shoot = src('shoot');
    img_shoot_wind = src('shoot-wind');
    img_shoot_cross = src('shoot-cross');
    img_shoot_hit = src('shoot-hit');
    img_shoot_miss1 = src('shoot-miss1');
    img_map_mode2 = src('map-mode2');
    img_map_mode1 = src('map-mode1');
}
