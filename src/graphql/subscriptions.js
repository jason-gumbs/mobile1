// eslint-disable
// this is an auto generated file. This will be overwritten

export const onCreateCompany = `subscription OnCreateCompany {
  onCreateCompany {
    id
    companyname
    email
    phonenumber
    files {
      bucket
      region
      key
    }
    visibility
    resources {
      items {
        id
        name
        product
        address
        location
        owner
        offering
        category
        city
        description
        number
        state
        zip
        content
      }
      nextToken
    }
  }
}
`;
export const onUpdateCompany = `subscription OnUpdateCompany {
  onUpdateCompany {
    id
    companyname
    email
    phonenumber
    files {
      bucket
      region
      key
    }
    visibility
    resources {
      items {
        id
        name
        product
        address
        location
        owner
        offering
        category
        city
        description
        number
        state
        zip
        content
      }
      nextToken
    }
  }
}
`;
export const onDeleteCompany = `subscription OnDeleteCompany {
  onDeleteCompany {
    id
    companyname
    email
    phonenumber
    files {
      bucket
      region
      key
    }
    visibility
    resources {
      items {
        id
        name
        product
        address
        location
        owner
        offering
        category
        city
        description
        number
        state
        zip
        content
      }
      nextToken
    }
  }
}
`;
export const onCreateResource = `subscription OnCreateResource {
  onCreateResource {
    id
    name
    product
    address
    location
    owner
    offering
    category
    city
    description
    number
    state
    zip
    visibility
    file {
      bucket
      region
      key
    }
    content
    comment {
      items {
        id
        content
      }
      nextToken
    }
    company {
      id
      companyname
      email
      phonenumber
    }
  }
}
`;
export const onUpdateResource = `subscription OnUpdateResource {
  onUpdateResource {
    id
    name
    product
    address
    location
    owner
    offering
    category
    city
    description
    number
    state
    zip
    visibility
    file {
      bucket
      region
      key
    }
    content
    comment {
      items {
        id
        content
      }
      nextToken
    }
    company {
      id
      companyname
      email
      phonenumber
    }
  }
}
`;
export const onDeleteResource = `subscription OnDeleteResource {
  onDeleteResource {
    id
    name
    product
    address
    location
    owner
    offering
    category
    city
    description
    number
    state
    zip
    visibility
    file {
      bucket
      region
      key
    }
    content
    comment {
      items {
        id
        content
      }
      nextToken
    }
    company {
      id
      companyname
      email
      phonenumber
    }
  }
}
`;
export const onCreateComment = `subscription OnCreateComment {
  onCreateComment {
    id
    content
    resource {
      id
      name
      product
      address
      location
      owner
      offering
      category
      city
      description
      number
      state
      zip
      content
    }
  }
}
`;
export const onUpdateComment = `subscription OnUpdateComment {
  onUpdateComment {
    id
    content
    resource {
      id
      name
      product
      address
      location
      owner
      offering
      category
      city
      description
      number
      state
      zip
      content
    }
  }
}
`;
export const onDeleteComment = `subscription OnDeleteComment {
  onDeleteComment {
    id
    content
    resource {
      id
      name
      product
      address
      location
      owner
      offering
      category
      city
      description
      number
      state
      zip
      content
    }
  }
}
`;
