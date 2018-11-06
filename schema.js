var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var personHourSchema = new Schema({_id: Schema.Types.ObjectId, person: Schema.Types.ObjectId, hours: Number});
var grantseekerSchema = new Schema({
	grantid: Schema.Types.ObjectId,
	userid: Schema.Types.ObjectId,
	template: Schema.Types.Boolean,
	globaltemplate: Schema.Types.Boolean,
	funder : String,
	program_name : String,
	primary_issue : String,
	past_grant : String,
	template : String,
	amount : Number,
	probability : Number,
	new_or_renewal : String,
	invited_or_unsolicited : String,
	type_of_support : String,
	type_of_application : String,
	length_of_award : Number,
	number_of_questions : Number,
	site_visit : String,
	loi : String,
	number_of_reports : String,
	preliminary_rsch_people : [personHourSchema],
	loi_requirements : [personHourSchema],
	pre_loi_comm : [personHourSchema],
	draft_loi : [personHourSchema],
	proposal_requirements : [personHourSchema],
	pre_proposal_comm : [personHourSchema],
	pre_proposal_mtg : [personHourSchema],
	gather_docs : [personHourSchema],
	prepare_budget : [personHourSchema],
	draft_proposal : [personHourSchema],
	format_app : [personHourSchema],
	gs_applications_other_label : String,
	gs_applications_other : [personHourSchema],
	follow_up_qs : [personHourSchema],
	site_visit : [personHourSchema],
	letter_signing : [personHourSchema],
	post_grant_comm : [personHourSchema],
	gs_compliance_other_label : String,
	gs_compliance_other : [personHourSchema],
	report_requirements : [personHourSchema],
	collect_data : [personHourSchema],
	prepare_financials : [personHourSchema],
	modifications : [personHourSchema],
	draft_report : [personHourSchema],
	monitoring_qs : [personHourSchema],
	gs_reporting_other_label : String,
	gs_reporting_other : [personHourSchema],
	gs_other_label : String,
	gs_additional_other : [personHourSchema],
});

module.exports = mongoose.model('grant', grantseekerSchema);
