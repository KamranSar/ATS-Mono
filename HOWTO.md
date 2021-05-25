### Start your development
- [ ] Change the name in `package.json`
- [ ] Change vuetify to the theme of your app in `@/config/vuetify.js`
- [ ] *If you have one*, convert your logo to the appropriate sizes
```sh
# If git clone fails due to permission... let us know
cd scripts
./image_resize.sh ~/Documents/Icons/logo.png # ~/Documents/Icons/logo.svg
# Move converted files to /public/img/icons/
```
- [ ] Create a new route in @/config/navItems.js to create your first component.
```javascript
{
  /** custom application properties
   * These can be expanded beyond the default: icon, and onClick properties.
   * Just be sure the '@/components/navigation/' components are updated appropriately.
   */
  icon: 'mdi-home',
  onClick: () => alert('Roll for initiative!'), // Set path to '' for onClick to fire.
  /** vue-router properties */
  path: '/home',
  name: 'Home',
  component: Home,
  // beforeEnter: Vue Router Guard // Optional,
  // redirect: String // Optional
  /** vue-browser-acl meta */
  meta: { // Optional
    can: 'is-admin',
    fail: '4oh4',
  },
},
```
- - [ ] Add it to `anonymousItems`, `userItems`, `adminItems`, or `userToolbarItems` at the bottom of `@/config/navItems.js`
- [ ] Copy `@/store/modules/examples.js` to create your first vuex module
- [ ] Persist it, *if your want*, by adding it to the `modules` array in `cookies.js`, `indexedDB.js`, or `localStorage.js` under `@/store/plugins/`
- [ ] Use vuex-pathify to easily interact with vuex modules
```javascript
import { sync, get } from "vuex-pathify";
computed: {
    ...sync("app", ["loading"]), // @/store/modules/app.js
    ...get("users", ["user"]), // @/store/modules/users.js
},
methods: {
    onClick() {
        this.loading = true;
        setTimeout(() => {
            console.log("User: ", user);
            this.loading = false;
        }, 300)
    }
}
```
- [ ] Create a feathers service to hook into and call APIs with
1. Create a new directory named after your service under @/feathers/services
2. Copy @/feathers/services/heartbeat/heatbeat.service.js into your new directory
3. Rename the file {servicename}.service.js
4. Change the servicePath to match yours in the file.
5. Use it like so in Vue
```javascript
import myservice from "@/feathers/services/my/my.service.js";
async mounted() {
    this.myData = await myservice.find({
        query: {
            stale: false,
            dataId: {
                $in: [ 1, 3, 4, 5]
            }
        }
    });
}
```