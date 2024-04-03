export const centarNavBarData: INavBarData[] = [
  {
    id: 1,
    link: '/',
    text: 'Home',
  },
  {
    id: 2,
    link: '/news/page/1',
    text: 'News',
  },
  {
    id: 3,
    link: '/about-us',
    text: 'About Us',
  },
  {
    id: 4,
    link: '/support-us',
    text: 'Support Us',
  },
  {
    id: 5,
    link: '/faq',
    text: 'FAQ',
  },
  {
    id: 6,
    link: '/media',
    text: 'Media',
  },
  {
    id: 7,
    link: '/blog/page/1',
    text: 'Blog',
  },
];

export interface INavBarData {
  id: number;
  link: string;
  text: string;
}
