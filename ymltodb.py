import yaml,pprint

def generateGrantseekerSchema(l):
	target = ""

	lines = []
	lines.append("var mongoose = require('mongoose');\n")
	lines.append("var Schema = mongoose.Schema;\n")
	lines.append("var grantseekerSchema = new Schema({\n")
	lines.append("\tgrantid: Schema.Types.ObjectId,\n")
	lines.append("\tuserid: Schema.Types.ObjectId,\n")
	

	for i in l:
		lines.append("\t"+i["field"]+" : "+i["type"]+",\n")

	lines.append("});\n\n")
	lines.append("module.exports = mongoose.model('grant', grantseekerSchema);\n")
	

	fo = open("schema.js", "w")
	fo.writelines( lines )
	fo.close()

def generateGrantmakerSchema(l):
	target = ""

	lines = []
	lines.append("var mongoose = require('mongoose');\n")
	lines.append("var Schema = mongoose.Schema;\n")
	lines.append("var grantmakerSchema = new Schema({\n")
	lines.append("\tgrantid: Schema.Types.ObjectId,\n")
	lines.append("\tuserid: Schema.Types.ObjectId,\n")
	

	for i in l:
		lines.append("\t"+i["field"]+" : "+i["type"]+",\n")

	lines.append("});\n\n")
	lines.append("module.exports = mongoose.model('grant', grantmakerSchema);\n")
	

	fo = open("maker.js", "w")
	fo.writelines( lines )
	fo.close()

lo = []
go = []

with open("../grantcalc/_data/grantseeker.yml", 'r') as stream:
    out = yaml.load(stream)

    for page in out:
	    for sect in page["sections"]:
	    	for quest in sect["questions"]:

	    		t = "String" if quest['type'] in ["dropdown","text"] else "Number"
	    		t = "Schema.Types.ObjectId" if quest['type'] == "peoplelist" else t

	    		o = {"field": quest['dbfield'], "type": t}
	    		lo.append(o)
	    		print o
		    	# print quest['dbfield']
generateGrantseekerSchema(lo)

with open("../grantcalc/_data/grantmaker.yml", 'r') as stream:
    out = yaml.load(stream)
    
    for page in out:
	    for sect in page["sections"]:
	    	for quest in sect["questions"]:
	    		t = "String" if quest['type'] in ["dropdown","text"] else "Number"
	    		t = "Schema.Types.ObjectId" if quest['type'] == "peoplelist" else t

	    		o = {"field": quest['dbfield'], "type": t}
	    		go.append(o)
	    		print o
		    	# print quest['dbfield']
generateGrantmakerSchema(go)




