/**
 * Generates a random birthdate within the given age range
 * @param {object} age age object
 * @returns {string} iso string
 */
export function getBirthdate(age) {
    const msInYear = 31557600000;
    const now = new Date().getTime();
    const earliest = now - (age.max * msInYear);
    const latest = now - (age.min * msInYear);
    const randomTime = earliest + Math.random() * (latest - earliest);

    let birthdate = new Date(randomTime);

    return birthdate.toISOString();
}

/**
 * Main function generating employees.
 * @param {object} dtoIn input data
 * @returns {object} dtoOut results
 */
 export function main(dtoIn) {
    // generates list of employees
    const employeeList = generateEmployeeData(dtoIn);
    // get statistics from the list
    return getEmployeeStatistics (employeeList);
}

//generateEmployeeData
export function generateEmployeeData(dtoIn) {

    let namesPool = [
        { name: "Jan", surname: "Holý", gender: "male", workload: 40 },
        { name: "Miroslav", surname: "Rezek", gender: "male", workload: 20 },
        { name: "Jaroslav", surname: "Raketa", gender: "male", workload: 30 },
        { name: "Rostislav", surname: "Holek", gender: "male", workload: 10 },
        { name: "Jana", surname: "Bílá", gender: "female", workload: 40 },
        { name: "Zdena", surname: "Holá", gender: "female", workload: 20 },
        { name: "Petr", surname: "Marek", gender: "male", workload: 30 },
        { name: "Eva", surname: "Nováková", gender: "female", workload: 40 }
    ];
let workloads = [10, 20, 30, 40];
let list = [];

    for (let i = 0; i < dtoIn.count; i++) {
        const person = namesPool[Math.floor(Math.random() * namesPool.length)];
        const workload = workloads[Math.floor(Math.random() * workloads.length)];

        list.push({
            gender: person.gender,
            birthdate: getBirthdate(dtoIn["age"]),
            name: person.name,
            surname: person.surname,
            workload:workload
        });
    }
    return list;
}

//statistics calculation

export function getEmployeeStatistics(employeeList) {
    let ages = [];
    let w10 = 0, w20 = 0, w30 = 0, w40 = 0;
    let femaleSum = 0, femaleCount = 0;
    let ageSum = 0;

    for (let i = 0; i < employeeList.length; i++) {
        let emp = employeeList[i];
        let age = (new Date().getTime() - new Date(emp.birthdate).getTime()) / 31557600000;

        ages.push(age);
        ageSum += age;

        if (emp.workload === 10) w10++;
        if (emp.workload === 20) w20++;
        if (emp.workload === 30) w30++;
        if (emp.workload === 40) w40++;
        if (emp.gender === "female") {
            femaleSum += emp.workload;
            femaleCount++;
        }
    }

    ages.sort((a, b) => a - b);
    let allWorkloads = employeeList.map(e => e.workload).sort((a, b) => a - b);

    function median(arr) {
        let m = Math.floor(arr.length / 2);
        return arr.length % 2 !== 0 ? arr[m] : (arr[m - 1] + arr[m]) / 2;
    }

    return {
        total: employeeList.length,
        workload10: w10,
        workload20: w20,
        workload30: w30,
        workload40: w40,
        averageAge: Math.round((ageSum / employeeList.length) * 10) / 10,
        minAge: Math.floor(ages[0]),
        maxAge: Math.floor(ages[ages.length - 1]),
        medianAge: Math.floor(median(ages)),
        medianWorkload: median(allWorkloads),
        averageWomenWorkload: femaleCount > 0 ? Math.round((femaleSum / femaleCount) * 10) / 10 : 0,
        sortedByWorkload: [...employeeList].sort((a, b) => a.workload - b.workload)
    };
}
