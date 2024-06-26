export default function manifest()   {
  return {
    "name": "Kerakoll",
    "short_name": "Kerakoll",
    "start_url": "/",
    "display": "standalone",
    "orientation": "portrait",
    "scope": "/",
    "background_color": "green",
    "theme_color": "black",
    "screenshots": [
      {
        "src": "/assets/images/screen.png",
        "sizes": "370x406",
        "type": "image/png",
        "purpose": "any"
      } 
    ],
    "description": "Kerakoll is the international leader in sustainable building",
    "icons": [
        {
          "src": "/assets/images/icons/icon-72x72.png",
          "type": "image/png", 
          "sizes": "72x72",
          "purpose": "any"
        },
        {
          "src": "/assets/images/icons/icon-96x96.png",
          "type": "image/png", 
          "sizes": "96x96",
          "purpose": "any"
        },
        {
          "src": "/assets/images/icons/icon-128x128.png",
          "type": "image/png",
          "sizes": "128x128",
          "purpose": "any"
        },
        {
          "src": "/assets/images/icons/icon-144x144.png",
          "type": "image/png", 
          "sizes": "144x144",
          "purpose": "any"
        },
        {
          "src": "/assets/images/icons/icon-192x192.png",
          "type": "image/png", 
          "sizes": "192x192",
          "purpose": "any"
        },
        {
          "src": "/assets/images/icons/icon-384x384.png",
          "type": "image/png", 
          "sizes": "384x384",
          "purpose": "any"
        },
        {
          "src": "/assets/images/icons/icon-512x512.png",
          "type": "image/png", 
          "sizes": "512x512",
          "purpose": "any"
        }
      ],
  };
}