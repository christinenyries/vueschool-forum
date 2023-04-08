import { Form, Field, ErrorMessage, defineRule, configure } from "vee-validate";
import { required, email, min, url } from "@vee-validate/rules";
import { localize } from "@vee-validate/i18n";
import { db } from "@/firebase";
import { where, getDocs, query, collection } from "firebase/firestore";

export default (app) => {
  defineRule("required", required);
  defineRule("email", email);
  defineRule("min", min);
  defineRule("url", url);
  defineRule("unique", async (value, args) => {
    let collectionName, field, excluding;
    if (Array.isArray(args)) {
      [collectionName, field, excluding] = args;
    } else {
      ({ collectionName, field, excluding } = args);
    }
    if (value === excluding) return true;
    const usersRef = collection(db, collectionName);
    const q = query(usersRef, where(field, "==", value));
    const querySnapshot = await getDocs(q);
    return querySnapshot.empty;
  });

  configure({
    generateMessage: localize("en", {
      messages: {
        required: "{field} is required",
        email: "{field} must be a valid email",
        min: "{field} must be 0:{min} characters long",
        unique: "{field} is already taken",
        url: "{field} must be a valid URL",
      },
    }),
  });
  app.component("VeeForm", Form);
  app.component("VeeField", Field);
  app.component("VeeErrorMessage", ErrorMessage);
};
