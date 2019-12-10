// @flow strict
import React from 'react';
import { Link } from 'gatsby';
import Author from './Author';
import Comments from './Comments';
import Content from './Content';
import Meta from './Meta';
import Tags from './Tags';
import styles from './Wiki.module.scss';
import type { Node } from '../../types';

type Props = {
  wiki: Node
};

const Wiki = ({ wiki }: Props) => {
  const { html } = wiki;
  const { tagSlugs, slug } = wiki.fields;
  const { tags, title, date } = wiki.frontmatter;

  return (
    <div className={styles['wiki']}>
      <Link className={styles['wiki__home-button']} to="/wiki">Wiki Home</Link>

      <div className={styles['wiki__content']}>
        <Content body={html} title={title} />
      </div>

      <div className={styles['wiki__footer']}>
        <Meta date={date} />
        {tags && tagSlugs && <Tags tags={tags} tagSlugs={tagSlugs} />}
        <Author />
      </div>

      <div className={styles['wiki__comments']}>
        <Comments postSlug={slug} postTitle={wiki.frontmatter.title} />
      </div>
    </div>
  );
};

export default Wiki;
