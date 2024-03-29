import S from "@sanity/desk-tool/structure-builder"
import {
  MdSettings,
  MdShare,
  MdList,
  MdInfo,
  MdPerson,
  MdDashboard
} from "react-icons/md"
import {
  CgDockBottom as FooterIcon,
} from "react-icons/cg"

const hiddenDocTypes = (listItem) =>
  ![
    "siteSettings",
    "menuLink",
    "socialLink",
    "author",
    "page",
    "post",
    "project",
    "theme",
    "themeLmColor",
    "themeDmColor",
  ].includes(listItem.getId())

export default () =>
  S.list()
    .title("Content")
    .items([
      S.listItem()
        .title("Site Settings")
        .icon(MdSettings)
        .child(
          S.list()
            .title("Site Settings")
            .items([
              S.listItem()
                .title("Metadata")
                .icon(MdInfo)
                .child(
                  S.document()
                    .title("Metadata")
                    .schemaType("siteSettings")
                    .documentId("siteSettings")
                ),
              S.listItem()
                .title("Footer")
                .icon(FooterIcon)
                .child(
                  S.document()
                    .title("Footer")
                    .schemaType("footerPage")
                    .documentId("footerDocument")
                ),
              // S.listItem()
              //   .title("Authors")
              //   .icon(MdPerson)
              //   .child(S.documentTypeList("author").title("Author")),
              S.listItem()
                .title("Navigation Links")
                .icon(MdList)
                .child(
                  S.documentTypeList("menuLink").title("Navigation Links")
                ),
              S.listItem()
                .title("Social Links")
                .icon(MdShare)
                .child(S.documentTypeList("socialLink").title("Social Links")),
              // S.listItem()
              //   .title("Theme-UI")
              //   .icon(MdDashboard)
              //   .child(
              //     S.document()
              //       .schemaType("theme")
              //       .documentId("theme")
              //       .title("Theme-UI Theme")
              //   ),
            ])
        ),
      // Add a visual divider (optional)
      S.divider(),
      S.listItem()
        .title("Pages")
        .child(S.documentTypeList("page").title("Pages")),
      // S.listItem()
      //   .title("Events")
      //   .child(S.documentTypeList("post").title("Events")),
      // S.listItem()
      //   .title("Services")
      //   .child(S.documentTypeList("project").title("Services")),
      // ...S.documentTypeListItems().filter(hiddenDocTypes),
    ])
