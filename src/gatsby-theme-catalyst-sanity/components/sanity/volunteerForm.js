import { Form, PersonSubForm, person} from "./formUtils"

const VolunteerForm = ({ node }) => {
    return (<Form
        initialValues = {{
            contactby: "Phone",
            person: [ person(node.info_questions) ],
        }}
        validate = {debounce(validateFn(node), 500)}
        onSubmit = {onSubmitFn(node)}>
            <PeresonSubForm name={'person'} questions={node.questions}/>
    </Form>)
}
