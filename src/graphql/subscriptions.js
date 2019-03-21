// eslint-disable
// this is an auto generated file. This will be overwritten
import gql from "graphql-tag";

export const onCreateCompany = gql`
  subscription OnCreateCompany {
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
export const onUpdateCompany = gql`
  subscription OnUpdateCompany {
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
export const onDeleteCompany = gql`
  subscription OnDeleteCompany {
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
export const onCreateResource = gql`
  subscription OnCreateResource {
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
        files {
          bucket
          region
          key
        }
      }
    }
  }
`;
export const onUpdateResource = gql`
  subscription OnUpdateResource {
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
        files {
          bucket
          region
          key
        }
      }
    }
  }
`;
export const onDeleteResource = gql`
  subscription OnDeleteResource {
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
        files {
          bucket
          region
          key
        }
      }
    }
  }
`;
export const onCreateComment = gql`
  subscription OnCreateComment {
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
export const onUpdateComment = gql`
  subscription OnUpdateComment {
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
export const onDeleteComment = gql`
  subscription OnDeleteComment {
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
