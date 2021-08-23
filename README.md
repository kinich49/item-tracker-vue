# item-tracker-vue

Welcome to Item tracker! This my first attempt at creating a vue app from scratch! 
This project was created with vue cli v 4.2.2

The intention of this project is to satisfy my need to keep track of my week-to-week shopping, such as groceries and stuff. This way I can visualice price increments, and be able to make better purchase decisions. 

If you want to use this project for yourself, feel free to fork it. You can also fork the backend, which is located in another repo. 

Feel free as well to report any bug or enhacement.

I hope you can forgive my lack of UX skills. 


## Project setup
```
npm install
```

You also need to add three local files
```
.env.developent
.env.local
.env.production
```

And set these variables accordingly to what you defined in your back-end environment. This is an ongoing project in development, so that's why we hardcode some credentials (But we don't want to upload them to remote repository)
```
VUE_APP_BASE_URL
VUE_APP_DEFAULT_USERNAME
VUE_APP_DEFAULT_PASSWORD
```

### Compiles and hot-reloads for development
```
npm run serve
```
App runs in port 4200.
### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).