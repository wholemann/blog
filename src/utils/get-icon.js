import { ICONS } from '../constants';

const getIcon = (name) => {
  let icon;

  switch (name) {
  
    case 'github':
      icon = ICONS.GITHUB;
      break;
    case 'email':
      icon = ICONS.EMAIL;
      break;
    case 'rss':
      icon = ICONS.RSS;
      break;
    default:
      icon = {};
      break;
  }

  return icon;
};

export default getIcon;
