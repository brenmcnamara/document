/* @flow */

import * as React from 'react';
import ContentIconButton from './ContentIconButton';
import ContentIconButtonGroup from './ContentIconButtonGroup';
import styles from './styles.css';

export type Props = {};

export default class ContentHeader extends React.Component<Props> {
  render() {
    return (
      <div className={styles.contentHeaderRoot}>
        <ContentIconButtonGroup children={"bold", "underline","italic", "code","highlighter"}>
          <ContentIconButton iconName="fas fa-bold" />
          <ContentIconButton iconName="fas fa-underline" />
          <ContentIconButton iconName="fas fa-italic" />
          <ContentIconButton iconName="fas fa-code" />
          <ContentIconButton iconName="fas fa-highlighter" />
        </ContentIconButtonGroup>

        <ContentIconButtonGroup children={"list-ul", "list-ol", "check-square","table"}>
          <ContentIconButton iconName="fas fa-list-ul" />
          <ContentIconButton iconName="fas fa-list-ol" />
          <ContentIconButton iconName="fas fa-check-square" />
          <ContentIconButton iconName="fas fa-table" />
        </ContentIconButtonGroup>

        <ContentIconButtonGroup children={"image", "video"}>
          <ContentIconButton iconName="fas fa-image" />
          <ContentIconButton iconName="fas fa-video" />
        </ContentIconButtonGroup>

        <ContentIconButtonGroup children={"comment"}>
          <ContentIconButton iconName="fas fa-comment" />
        </ContentIconButtonGroup>
      </div>
    );
  }
}
