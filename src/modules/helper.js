import React from 'react';

class Helper {
  constructor(props) {
    this.props = props;
  }

  setSelectOrganization(data) {
    const organizations = [...data];
    const treeOrganization = [];
    const firstNode = organizations.reduce((object, element) =>
      (object.nParent ? parseInt(object.nParent) : 0) <=
      (element.nParent ? parseInt(element.nParent) : 0)
        ? object
        : element,
    );
    const findFirstNode = organizations.filter(
      (element) => element.nParent == firstNode.nParent,
    );
    findFirstNode.forEach((element) => {
      treeOrganization.push(this.organizationChild(organizations, element));
    });

    return treeOrganization;
  }

  organizationChild(list, parent) {
    const newOrganization = this.setObjectOrganization(parent);
    const findChildren = list.filter(
      (element) => parseInt(element.nParent) === parseInt(parent.org_id),
    );
    findChildren.forEach((element) => {
      newOrganization.children.push(this.organizationChild(list, element));
    });

    return newOrganization;
  }

  setOrganizationData(data) {
    const newData = [];

    data.forEach((element) => {
      newData.push(this.setObjectOrganization(element));
    });

    return newData;
  }

  setObjectOrganization(data) {
    const setOrganization = {
      key: data.org_id.toString(),
      title: data.name ? data.name.toString() : data.org_id.toString(),
      children: [],
      value: data.org_id,
    };

    return setOrganization;
  }
}

export default Helper;
