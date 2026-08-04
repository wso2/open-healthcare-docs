import React from 'react';
import DocBreadcrumbs from '@theme-original/DocBreadcrumbs';
import {useDoc} from '@docusaurus/theme-common/internal';
import {useLocation} from '@docusaurus/router';
import useBaseUrl from '@docusaurus/useBaseUrl';
import MarkdownButton from './MarkdownButton';
import styles from './styles.module.css';

export default function DocBreadcrumbsWrapper(props) {
  const {metadata} = useDoc();
  const location = useLocation();
  const docsBaseUrl = useBaseUrl('/docs');

  // metadata.id is relative to docs/ with the extension stripped — matching
  // what the markdown-export plugin writes under static/docs/ and build/docs/.
  const markdownUrl = location.pathname.startsWith(docsBaseUrl)
    ? `${docsBaseUrl}/${metadata.id}.md`
    : null;

  return (
    <div className={styles.breadcrumbRow}>
      <div className={styles.breadcrumbsLeft}>
        <DocBreadcrumbs {...props} />
      </div>
      {markdownUrl && <MarkdownButton markdownUrl={markdownUrl} />}
    </div>
  );
}
