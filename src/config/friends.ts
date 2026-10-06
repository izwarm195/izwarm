/**
 * 友链配置：About → Friends 面板的唯一数据源。
 *
 * 加一位朋友只改这里（数组顺序就是页面顺序），组件与样式都不用动：
 * - name：站点名（卡片标题，也是图标加载失败时的首字来源）
 * - url ：对方站点地址 ——「访问」打开它，「复制」复制的也是它
 * - desc：一句简介
 * - icon：图标地址。可以填对方的 favicon/avatar 外链，也可以填本站
 *         public/media/ 下的本地文件（写成 /media/xxx.png，注意子路径部署时
 *         请用 media 配置里的前缀）；外链加载失败时卡片自动退回首字方块
 * - initial：首字方块的文字，缺省取 name 的第一个字符
 */
export interface FriendLink {
  name: string;
  url: string;
  desc: string;
  icon: string;
  initial?: string;
}

export const friends: FriendLink[] = [
  {
    name: '沿途',
    url: 'https://blog.wubingchen.com/',
    desc: '计算机网络与生活观察。',
    icon: 'https://blog.wubingchen.com/favicon.svg',
    initial: '沿',
  },
];

/** 友链卡上展示的地址文字：去掉协议与末尾斜杠，长路径省略中间 */
export function displayHost(url: string): string {
  return url.replace(/^https?:\/\//, '').replace(/\/+$/, '');
}
