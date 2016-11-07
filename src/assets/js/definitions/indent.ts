import * as Modes from '../modes';
import keyDefinitions from '../keyDefinitions';

const MODES = Modes.modes;

const visual_line_indent = () =>
  async function() {
    await this.session.indentBlocks(this.row_start, this.num_rows);
    await this.session.setMode(MODES.NORMAL);
    this.keyStream.save();
  }
;

const visual_line_unindent = () =>
  async function() {
    await this.session.unindentBlocks(this.row_start, this.num_rows);
    await this.session.setMode(MODES.NORMAL);
    this.keyStream.save();
  }
;

const CMD_INDENT_RIGHT = keyDefinitions.registerCommand({
  name: 'INDENT_RIGHT',
  default_hotkeys: {
    normal_like: ['>'],
  },
});
keyDefinitions.registerAction([MODES.NORMAL], CMD_INDENT_RIGHT, {
  description: 'Indent row right',
}, async function() {
  await this.session.indent();
  this.keyStream.save();
});
keyDefinitions.registerAction([MODES.INSERT], CMD_INDENT_RIGHT, {
  description: 'Indent row right',
}, async function() {
  await this.session.indent();
});
// NOTE: this matches block indent behavior, in visual line
keyDefinitions.registerAction([MODES.VISUAL_LINE], CMD_INDENT_RIGHT, {
  description: 'Indent row right',
}, visual_line_indent());

const CMD_INDENT_LEFT = keyDefinitions.registerCommand({
  name: 'INDENT_LEFT',
  default_hotkeys: {
    normal_like: ['<'],
  },
});
keyDefinitions.registerAction([MODES.NORMAL], CMD_INDENT_LEFT, {
  description: 'Indent row left',
}, async function() {
  await this.session.unindent();
  this.keyStream.save();
});
keyDefinitions.registerAction([MODES.INSERT], CMD_INDENT_LEFT, {
  description: 'Indent row left',
}, async function() {
  await this.session.unindent();
});
// NOTE: this matches block indent behavior, in visual line
keyDefinitions.registerAction([MODES.VISUAL_LINE], CMD_INDENT_LEFT, {
  description: 'Indent row left',
}, visual_line_unindent());

const CMD_MOVE_BLOCK_RIGHT = keyDefinitions.registerCommand({
  name: 'MOVE_BLOCK_RIGHT',
  default_hotkeys: {
    normal_like: ['tab', 'ctrl+l'],
    insert_like: ['tab'],
  },
});
keyDefinitions.registerAction([MODES.NORMAL, MODES.INSERT], CMD_MOVE_BLOCK_RIGHT, {
  description: 'Move block right',
}, async function() {
  this.keyStream.save(); // important for insert mode
  await this.session.indentBlocks(this.session.cursor.path, this.repeat);
  this.keyStream.save();
});
keyDefinitions.registerAction([MODES.VISUAL_LINE], CMD_MOVE_BLOCK_RIGHT, {
  description: 'Move block right',
}, visual_line_indent());

const CMD_MOVE_BLOCK_LEFT = keyDefinitions.registerCommand({
  name: 'MOVE_BLOCK_LEFT',
  default_hotkeys: {
    normal_like: ['shift+tab', 'ctrl+h'],
    insert_like: ['shift+tab'],
  },
});
keyDefinitions.registerAction([MODES.NORMAL, MODES.INSERT], CMD_MOVE_BLOCK_LEFT, {
  description: 'Move block left',
}, async function() {
  this.keyStream.save(); // important for insert mode
  await this.session.unindentBlocks(this.session.cursor.path, this.repeat);
  this.keyStream.save();
});
keyDefinitions.registerAction([MODES.VISUAL_LINE], CMD_MOVE_BLOCK_LEFT, {
  description: 'Move block left',
}, visual_line_unindent());

const CMD_MOVE_BLOCK_DOWN = keyDefinitions.registerCommand({
  name: 'MOVE_BLOCK_DOWN',
  default_hotkeys: {
    normal_like: ['ctrl+j'],
  },
});
keyDefinitions.registerAction([MODES.NORMAL, MODES.INSERT], CMD_MOVE_BLOCK_DOWN, {
  description: 'Move block down',
}, async function() {
  await this.session.swapDown();
  if (this.mode === MODES.NORMAL) {
    this.keyStream.save();
  }
});

const CMD_MOVE_BLOCK_UP = keyDefinitions.registerCommand({
  name: 'MOVE_BLOCK_UP',
  default_hotkeys: {
    normal_like: ['ctrl+k'],
  },
});
keyDefinitions.registerAction([MODES.NORMAL, MODES.INSERT], CMD_MOVE_BLOCK_UP, {
  description: 'Move block up',
}, async function() {
  await this.session.swapUp();
  if (this.mode === MODES.NORMAL) {
    this.keyStream.save();
  }
});
