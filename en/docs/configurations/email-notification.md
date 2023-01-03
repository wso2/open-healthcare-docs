# Configurations for Enabling Email Notifications

This page documents the configurations that should be added in order to enable email notifications to the 'deployment.toml' file under <code>&lt;OH_APIM_HOME&gt;/repository/conf</code>.

Email notifications can be enabled for the following events:<br>
<ul>
    <li>User registration request.</li>
    <li>User approval/rejection.</li>
    <li>Application creation request.</li>
    <li>Application approval/rejection.</li>
</ul>


### Organization Details

This is a required configuration.

```
    [healthcare.organization]
    org_name = "testOrg"
    contact_email = "support@testorg.com"
    timezone = "GMT"
```

### Upon User Registration

```
    [[healthcare.notification.mail]]
    name = "new_user_signup_requested_internal"
    enable = true
    recipient_roles = "approver,approver2"
    recipients = "user1@test.com,user2@test.com"
    email_subject = "[Developer Portal]  New User Signup - ${first_name} ${last_name}"
    email_body = "<html><body>A new user has signed up at ${time} [${timezone}] on ${date}. Visit the <a href=\"${server_url}/admin/tasks/user-creation/\">admin portal</a> to approve/reject.</body></html>"
```

!!! tip
    <strong>Note:</strong>The values given within '${}' are the default placeholders that will be populated internally.

### Upon User Approval/Rejection - To Specified Roles and Receipients

```
    [[healthcare.notification.mail]]
    name = "new_user_signup_completed_internal"
    enable = true
    recipient_roles = "approver,approver2"
    recipients = "user1@test.com,user2@test.com"
    email_subject = "[Developer Portal]  New User Signup - ${first_name} ${last_name}"
    email_body = "<html><body>Signup request has been ${status} by ${approver}.</body></html>"
```

### Upon User Approval/Rejection - To the User

```
    [[healthcare.notification.mail]]
    name = "new_user_signup_completed_external"
    enable = true
    email_subject = "[${org_name} Developer Portal] Your Signup Request Status"
    email_body = "<html><body>Your signup request has been ${status}. Please email ${contact_email} if you have any questions.<br/>Thank you for your interest.<br/></body></html>"
```

### Upon Application Creation

```
    [[healthcare.notification.mail]]
    name = "new_app_creation_requested_internal"
    enable = true
    recipient_roles = "approver,approver2"
    recipients = "user1@test.com,user2@test.com"
    email_subject = "[Developer Portal] New Application ${app_name} Created by ${user_name}"
    email_body = "<html><body>A new application has been created. Visit the <a href=\"${server_url}/admin/tasks/application-creation/\">admin portal</a> to approve/reject.</body></html>"
```

### Upon Application Approval/Rejection - To Specified Roles and Receipients

```
    [[healthcare.notification.mail]]
    name = "new_app_creation_completed_internal"
    enable = true
    recipient_roles = "approver,approver2"
    recipients = "user1@test.com,user2@test.com"
    email_subject = "[Developer Portal] New Application ${app_name} Created by ${user_name}"
    email_body = "<html><body>Application creation request has been ${status} by ${approver}.</body></html>"
```

### Upon Application Approval/Rejection - To the User

```
    #[[healthcare.notification.mail]]
    #name = "new_app_creation_completed_external"
    #enable = true
    #email_subject = "[${org_name} Developer Portal] Your Application Creation Request Status"
    #email_body = "<html><body>Your request to create the application ${app_name} has been ${status}. Please email ${contact_email} if you have any questions.<br/>Thank you for your interest.<br/></body></html>"
```