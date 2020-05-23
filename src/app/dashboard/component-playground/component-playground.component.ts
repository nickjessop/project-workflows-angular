import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-component-playground',
    templateUrl: './component-playground.component.html',
    styleUrls: ['./component-playground.component.scss'],
})
export class ComponentPlaygroundComponent implements OnInit {
    constructor() {}
    test = [
        {
            name: 'Neck Pain Relief',
            exercises: [
                'Shoulder Shrug',
                'Backward Arm Stretch',
                'Forward Arm Stretch',
                'Neck Turn',
                'Side Neck Tilt',
                'Neck Protraction',
                'Backward Neck Tilt',
                'Forward Neck Tilt',
            ],
            equipment: [],
        },
        {
            name: 'Neck and Shoulder Pain',
            exercises: [
                'Forward Neck Tilt',
                'Backward Neck Tilt',
                'Neck Turn',
                'Shoulder Shrug',
                'Shoulder Rolls',
                'Shoulder Stretch, Clasped Hands',
                'Forward Arm Stretch',
                'Backward Arm Stretch',
                'Arm Crossover',
            ],
            equipment: [],
        },
        {
            name: 'Upper Back Pain Relief',
            exercises: [
                'Forward Neck Tilt',
                'Shoulder Rolls',
                'Side Stretch',
                'Shoulder Stretch, Clasped Hands',
                'Torso Rotation',
                'Cat-Cow Pose',
                'Mid Trap Lifts',
                'Head to Knee',
                "Child's Pose",
            ],
            equipment: [],
        },
        {
            name: 'Lower Back Pain Relief',
            exercises: [
                'Forward Fold',
                'Hamstring Curls, Lying',
                'Hamstring Stretch, Lying',
                'Bird-Dog Pose',
                'Side Stretch',
                'Torso Rotation',
                'Cat-Cow Pose',
            ],
            equipment: ['Resistance Band, Heavy Duty'],
        },
        {
            name: 'Tight Hip Relief',
            exercises: [
                'Piriformis Stretch, Seated',
                'Hip Extension',
                'Internal Hip Rotation',
                'External Hip Rotation',
            ],
            equipment: ['Ankle Weights'],
        },
        {
            name: 'Leg Pain Relief',
            exercises: [
                'Single Leg Squats',
                'Single Leg Stance',
                'Stairwell Calf Stretch',
                'Calf Stretch, Bent Knee',
                'Calf Raises',
                'Calf Stretch',
            ],
            equipment: [],
        },
        {
            name: 'Calming Stretches',
            exercises: [
                'Forward Fold',
                'Shoulder Stretch, Clasped Hands',
                'Side Stretch',
                'Arm Circles',
                'Shoulder Rolls',
                'Shoulder Shrug',
                'Forward Lunge, Twist',
                'Dead Bug',
                'Knee to Chest, Lying',
                'Head to Knee',
                "Child's Pose",
            ],
            equipment: [],
        },
        {
            name: 'Progressive Muscle Relaxation',
            exercises: [
                'Forehead Tension Release',
                'Eyes Tension Release',
                'Mouth & Jaw Tension Release',
                'Neck Tension Release',
                'Shoulders Tension Release',
                'Upper Arms Tension Release',
                'Forearms and Wrists Tension Release',
                'Hands Tension Release',
                'Chest Tension Release',
                'Stomach Tension Release',
                'Buttocks Tension Release',
                'Upper Leg Tension Release',
                'Lower Leg Tension Release',
                'Feet Tension Release',
            ],
            equipment: [],
        },
        {
            name: 'Energy Booster',
            exercises: [
                'Shoulder Rolls',
                'Side Stretch, Forward Fold',
                'Forward Lunge, Twist',
                'Jumping Jacks',
                'High Kicks',
                'Jump squats',
            ],
            equipment: [],
        },
        {
            name: 'Upper Body & Core Tune-up',
            exercises: [
                'Single Leg Squats',
                'Push Up',
                'Bird-Dog Pose',
                'Plank',
                'Half-Bridge Pose',
                'Dead Bug',
                'Bent Knee V-Taps',
            ],
            equipment: [],
        },
        {
            name: 'Quick Full Body Desk Break',
            exercises: ['Forward Fold', 'Side Stretch', 'Forward Lunge', 'Knee to Chest, Standing', 'Calf Stretch'],
            equipment: [],
        },
    ];
    ngOnInit() {}
}
