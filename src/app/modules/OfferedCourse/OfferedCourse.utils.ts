import { TSchedule } from "./OfferedCourse.interface";


export const hasTimeConflict =(assignedSchedules:TSchedule[],newSchedule:TSchedule) => {

    for(const schedule of assignedSchedules){
        const existingStartTime = new Date(`1970-01-01T${schedule.startTime}`) // date er maddhomei time k comparison korte hbe.
        const existingEndTime = new Date(`1970-01-01T${schedule.endTime}`)
        const newStartTime = new Date(`1970-01-01T${newSchedule.startTime}`)
        const newEndTime = new Date(`1970-01-01T${newSchedule.endTime}`)
  
        //10:30 - 12:30
        //9:30 - 11:30
        if(existingEndTime > newStartTime && existingStartTime < newEndTime){
            return true
          }
    }
    return false 
}



