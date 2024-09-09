# How to update Open Healthcare solution?

Usually Open Healthcare accelerators are the implementation which accelerate and facilitate the FHIR related features, these accelerators will be applied on top of 
the wso2 base products like APIM and MI inorder to cater the healthcare domain problems.

Inorder to get updates for Open Healthcare solution we need to get the update for two separate products as below,

* Download the GA/ Vanilla pack of the wso2 base products like APIM or MI.
* Update the base products to the latest/ desire update level.
* Download the GA/ Vanilla pack of the WSO2 Healthcare Solution accelerators.
* Update the WSO2 Healthcare Solution accelerators to the latest/ desire update level.
* Then apply the accelerators on top of the base products. Please read more about [installation of accelerator](/install-and-setup/manual).

![Update process]({{base_path}}/assets/img/install-and-setup/updates/update-oh-accelerator.png)

# Continuous update

Receiving continuous updates to your environment can be done with ease using WSO2 recommended configuration management tools, which are Puppet and Ansible.
We highly recommend that to set up an automation tool like Puppet or Ansible, and automate the update process which mention [above](/install-and-setup/updates/update-accelerators).

Using this automation you can easily install and test new updates on lower environments, and can propagate to the higher environments like Production.

![Continuous update]({{base_path}}/assets/img/install-and-setup/updates/continuos-update.png)
