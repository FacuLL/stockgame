
export function deleteEmptyFields(object: any): any {
    for (let key in object) {
        let value: any = object[key];
        if (value?.trim) value = value.trim();
        if (value == "" || !value) delete object[key];
    }
    return object;
}