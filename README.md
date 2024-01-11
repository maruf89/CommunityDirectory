Setup
====

Plugins WPUser and Advanced Custom Fields are required for this plugin to work. Upon their activation, this plugin should activate.

Registration Setup
====

This plugin creates uses locations to differentiate where entities reside. The location is set upon user creation, so that they cannot be changed, unless an administrator changes the user's location (might not be built yet). To allow users to set their location, a custom field in WPUser's registration form needs to be added.

- Under UsersWP > Form Builder on the initial tab under `Predefined Fields`, click on `Community Directory Location`
- Set how you'd like the field to display
- Enablie `Is active`
- Enable `Is Required`
- Click on the `Advanced` button to show more fields
- Enable `Include this field in register form` as well as `Include this field ONLY in register form`
- Hit save

Next…

- Go to the `Registration` tab at the top
- Click the newly created field which should appear on the left, and save

Lastly…

- Go to UsersWP > General
- Below `Page Settings` select on which template you'd like the registration to show
- Next click on the Registration link at the top under the tabs
- Fill out the fields and save

Your login registration should now have the location select field. Upon registering you're new users will have a custom `subscriber_entity` role which will allow them to fill out a profile and post their offers and needs

ReCaptcha Support
-----
By defining somewhere in your config the keys `RECAPTCHA_V3_KEY` and `RECAPTCHA_V3_SECRET`, and loading the recaptcha script `wp_enqueue_script( 'reCaptcha', 'https://www.google.com/recaptcha/api.js', [], '3' );` recaptcha fields will be added the registration field


Entities
====
All users with locations upon registering are granted `subscriber_entity` roles which allows them to edit their entity profile, and post offers & needs. Entities are capable of showing their location, but in order for that, they need a Google API Key (temporarily until )

Brevo Email Support
---
To Enable Brevo transaction emailer, add your api key to your .env or config so it's available as a constant like

```.env
BREVO_ENABLE=1
BREVO_API_KEY='api_key'
```


To Do
=====

# Places
- Show distance from Muse river

# Flaggable
- Anything that's user generated/submitted should be flaggable for indecency (button)
- It should contain an optional text field to submit
- Submission sends information of
    + the flagged content
    + The sender (if logged in - sets a higher priority)
    + \# of times it's been flagged (priority)
- submission sends an e-mail to me until a tab for it is built

# Around Me

Menu button which links to the user's backend where nearby offers/needs are shown

