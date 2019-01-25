/* @flow */

import * as React from 'react';
import Doc from '../components/Doc.react';
import H1 from '../components/H1.react';
import H2 from '../components/H2.react';
import H3 from '../components/H3.react';
import LI from '../components/LI.react';
import TextBlock from '../components/TextBlock.react';
import UL from '../components/UL.react';

export default function Basic() {
  return (
    <Doc>
      <H1>{'Book Design'}</H1>

      <TextBlock>
        {`Book design is the art of incorporating the content, style, format,
          design, and sequence of the various components and elements of a book
          into a coherent unit. In the words of the renowned typographer Jan
          Tschichold (1902–1974), book design, "though largely forgotten today,
          [relies upon] methods and rules upon which it is impossible to
          improve, [and which] have been developed over centuries. To produce
          perfect books, these rules have to be brought back to life and
          applied". Richard Hendel describes book design as "an arcane
          subject", and refers to the need for a context to understand what
          that means.`}
      </TextBlock>

      <H2>{'Structure'}</H2>

      <TextBlock>
        {`Modern books are paginated consecutively, and all pages are counted
          in the pagination whether or not the numbers appear. The page number,
          or folio, is most commonly found at the top of the page, flush left
          verso, flush right recto. The folio may also be printed at the
          bottom of the page, and in that location it is called a drop folio.
          Drop folios usually appear either centered on each page or flush left
          verso and flush right recto`}
      </TextBlock>

      <H3>{'Front Matter'}</H3>

      <TextBlock>
        {`Front matter (or preliminaries; shortened to "prelims") comprises the
          first section of a book, and is usually the smallest section in terms
          of the number of pages. Front-matter pages are traditionally numbered
          in lower-case Roman numerals (i, ii, iii, iv, v, etc.), which
          prevents renumbering the remainder of a book when front-matter
          content is added at the last moment, such as a dedication page or
          additional acknowledgments. Page number is omitted on blank pages and
          display pages (i.e., such stand-alone pages as those for the half
          title, frontispiece, title page, colophon, dedication, and
          epigraph), and it is either omitted or a drop folio is used on the
          opening page of each section of the front matter (e.g., table of
          contents, foreword, preface).[3] Front matter generally appears only
          in the first of a multi-volume work, although some elements (such as
          a table of contents or index) may appear in each volume.`}
      </TextBlock>

      <TextBlock>
        {`The following table defines some common types of front matter, and
          the "voice" (or point of view) in which each can be said to be
          given:`}
      </TextBlock>

      <TextBlock>{`-- TABLE OMITTED --`}</TextBlock>

      <H3>{'Body Matter'}</H3>

      <TextBlock>
        {`The structure of a work—and especially of its body matter—is often
          described hierarchically.`}
      </TextBlock>

      <UL><LI>{'Volumnes'}</LI></UL>

      <TextBlock nestDepth={1}>
        {`A volume is a set of leaves bound together. Thus each work is either
          a volume, or is divided into volumes.`}
      </TextBlock>

      <UL><LI>{'Books and Parts'}</LI></UL>

      <TextBlock nestDepth={1}>
        {`Single-volume works account for most of the non-academic consumer
          market in books. A single volume may embody either a part of a book
          or the whole of a book; in some works, parts encompass multiple books,
          while in others, books may consist of multiple parts.`}
      </TextBlock>

      <UL><LI>{'Chapters and sections'}</LI></UL>

      <TextBlock nestDepth={1}>
        {`A chapter or section may be contained within a part or a book. When
          both chapters and sections are used in the same work, the sections
          are more often contained within chapters than the reverse.`}
      </TextBlock>

      <UL><LI>{'Modules and Units'}</LI></UL>

      <TextBlock nestDepth={1}>
        {`In some books the chapters are grouped into bigger parts, sometimes
          called modules. The numbering of the chapters can begin again at the
          start of every module. In educational books, especially, the chapters
          are often called units.`}
      </TextBlock>

      <TextBlock>
        {`The first page of the actual text of a book is the opening page,
          which often incorporates special design features, such as initials.
          Arabic numbering starts at this first page. If the text is introduced
          by a second half title or opens with a part title, the half title or
          part title counts as page one. As in the front matter, page numbers
          are omitted on blank pages, and are either omitted or a drop folio is
          used on the opening page of each part and chapter. On pages containing
          only illustrations or tables, page numbers are usually omitted, except
          in the case of a long sequence of figures or tables.`}
      </TextBlock>

      <TextBlock>
        {`The following are two instructive examples:`}
      </TextBlock>

      <UL>
        <LI>
          {`The Lord of the Rings has three parts (either in one volume each, or
            in a single volume), with each part containing two books, each
            containing, in turn, multiple chapters.`}
        </LI>
        <LI>
          {`The Christian Bible (usually bound as a single volume) is divided
            into two "testaments" (which might more typically be described as
            "parts", and differ in length by a factor of three or four), each
            containing dozens of books, each in turn containing multiple
            chapters, which are most often divided (for purposes of citation)
            into "verses" each containing roughly one independent clause.`}
        </LI>
      </UL>
    </Doc>
  );
}
