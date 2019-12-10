// @flow strict
import React from 'react';
import { Link } from 'gatsby';
import kebabCase from 'lodash/kebabCase';
import Sidebar from '../components/Sidebar';
import Layout from '../components/Layout';
import Page from '../components/Page';
import { useSiteMetadata, useWikiList } from '../hooks';

import moment from 'moment';

const WikiIndexTemplate = () => {
  const { edges } = useWikiList();

  edges.sort((a, b) => a.node.parent.mtime - b.node.parent.mtime);

  return (
    <Layout title={`홀맨의 지식저장소`}>
      <Page title="최근 변경된 문서">
        <ul>
          {edges.map((edge) => (
            <li key={edge.node.fields.slug}>
              <Link to={edge.node.fields.slug}>
                {edge.node.frontmatter.title} ... {moment(edge.node.parent.modifiedTime).format('YYYY-MM-DD HH:mm:ss')}
              </Link>
            </li>
          ))}
        </ul>
      </Page>
    </Layout>
  );
};

export default WikiIndexTemplate;
