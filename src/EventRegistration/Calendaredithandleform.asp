<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN">

<HTML>
<HEAD>
 <title>Add an Alpaca</title>
       <link rel="stylesheet" type="text/css" href="/administration/style.css">


</HEAD>

<BODY  border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0  bgcolor = "white">


<!--#Include virtual="/Administration/Header.asp"--> 

<SCRIPT LANGUAGE="JavaScript">

<!-- Begin
   var submitcount=0;
   function checkSubmit() {

      if (submitcount == 0)
      {
      submitcount++;
      document.Surv.submit();
      }
   }


function wordCounter(field, countfield, maxlimit) {
wordcounter=0;
for (x=0;x<field.value.length;x++) {
      if (field.value.charAt(x) == " " && field.value.charAt(x-1) != " ")  {wordcounter++}  // Counts the spaces while ignoring double spaces, usually one in between each word.
      if (wordcounter > 250) {field.value = field.value.substring(0, x);}
      else {countfield.value = maxlimit - wordcounter;}
      }
   }

function textCounter(field, countfield, maxlimit) {
  if (field.value.length > maxlimit)
      {field.value = field.value.substring(0, maxlimit);}
      else
      {countfield.value = maxlimit - field.value.length;}
  }
//  End -->
</script>

<%	Dim TotalCount
	dim rowcount, ID

	dim FullName(40000)
	dim SampleAge(40000)
	dim SampleDate(40000)
	dim Average(40000)
	dim StandardDev(40000)
	dim COV(40000)
	dim GreaterThan30(40000)
	dim CF(40000)
	dim Curve(40000)
	dim ShearWeight(40000)
	dim BlanketWeight(40000)
	dim Length(40000)
	dim CrimpPerInch(40000)


TotalCount= Request.Form("TotalCount")
'rowcount = CInt(rowcount)
rowcount = 0

ID=Request.Form("ID")
conn = "Provider=Microsoft.Jet.OLEDB.4.0;" & _
						"Data Source=" & server.mappath(databasepath) & ";" & _
						"User Id=;Password=;" 

			 sql2 = "select * from fiber where ID = " &  ID & ";" 
			'response.write(sql2)
	Set rs2 = Server.CreateObject("ADODB.Recordset")
    rs2.Open sql2, conn, 3, 3   
    If rs2.eof Then


For rowcount = 1 To 10
	FullNamecount = "FullName(" & rowcount & ")"
	SampleDatecount = "SampleDate(" & rowcount & ")"
	Averagecount = "Average(" & rowcount & ")"
	StandardDevcount = "StandardDev(" & rowcount & ")"
	COVcount = "COV(" & rowcount & ")"
	GreaterThan30count = "GreaterThan30(" & rowcount & ")"
	CFcount = "CF(" & rowcount & ")"
	Curvecount = "Curve(" & rowcount & ")"
	SampleAgecount = "SampleAge(" & rowcount & ")"
	ShearWeightcount = "ShearWeight(" & rowcount & ")"
	BlanketWeightcount = "BlanketWeight(" & rowcount & ")"
	Lengthcount = "Length(" & rowcount & ")"
	CrimpPerInchcount = "CrimpPerInch(" & rowcount & ")"
	
	
	FullName(rowcount)=Request.Form(FullNamecount) 
	SampleDate(rowcount)=Request.Form(SampleDatecount )
	Average(rowcount)=Request.Form(Averagecount) 
	StandardDev(rowcount)=Request.Form(StandardDevcount) 
	COV(rowcount)=Request.Form(COVcount) 
	GreaterThan30(rowcount)=Request.Form(GreaterThan30count) 
	CF(rowcount)=Request.Form(CFcount) 
	Curve(rowcount)=Request.Form(Curvecount) 
	SampleAge(rowcount)=Request.Form(SampleAgecount) 
	ShearWeight(rowcount)=Request.Form(ShearWeightcount) 
	BlanketWeight(rowcount)=Request.Form(BlanketWeightcount) 
	Length(rowcount)=Request.Form(Lengthcount) 
	CrimpPerInch(rowcount)=Request.Form(CrimpPerInchcount) 


    

Query =  "INSERT INTO Fiber ( ID, SampleDate,  Average, StandardDev, COV,  ShearWeight, BlanketWeight, GreaterThan30)" 
	Query =  Query + " Values (" +  ID + " ,"
	Query =  Query +  " '" + SampleDate(rowcount) + "', " 
    Query =  Query +  " '" + Average(rowcount) + "'," 
    Query =  Query +   " '" + StandardDev(rowcount) + "'," 
    Query =  Query +  " '" +  COV(rowcount) + "'," 
	Query =  Query +  " '" +  ShearWeight(rowcount) + "'," 
	Query =  Query +  " '" +  BlanketWeight(rowcount) + "'," 
    Query =  Query +  " '" + GreaterThan30(rowcount)  + "')" 

'response.write(Query)	

Dim DataConnection, cmdDC, RecordSet
Dim RecordToEdit, Updated
Set DataConnection = Server.CreateObject("ADODB.Connection")

DataConnection.Open "DRIVER={Microsoft Access Driver (*.mdb)};DBQ=" & Server.MapPath(DatabasePath) & ";" 



DataConnection.Execute(Query) 

next



	DataConnection.Close
	Set DataConnection = Nothing 
 End If
%>
<table  border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0 width = "800">
	<tr>
		<td class = "body">
			<a name="Add"></a>
			<H1>Add a New Alpaca Wizard</H1>
			
			<img src = "images/line.jpg">
		</td>
	</tr>
</table>

<table border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0 bordercolor = "" align = "center" width = "800">
	<tr>
		<td class = "body">
			<h2><font color = "brown">Step 4: Description</font></h2>
		</td>
	</tr>
	</table>
<form action= 'AddAnAlpaca5.asp' method = "post">
<table border = "0" bordercolor = "bbbbbb" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0 width = "750" align = "center">
	<tr>
	   <td align = "center">
		<textarea name="Description" cols="77" rows="26"  onKeyDown="textCounter(this.form.Description,this.form.remLentext,1600);" onKeyUp="textCounter(this.form.Description,this.form.remLentext,1600);"></textarea>
		<br>Characters remaining: <input type=box readonly name=remLentext size=3 value=1600>
		</td>
	</tr>
<tr>
		<td colspan = "4" align = "center" valign = "middle">
			<input type = "hidden" name="ID" value= "<%= ID%>" >
			<input type=submit value = "Submit Changes" style="background-image: url('images/background.jpg'); border-width:1px" size = "110" class = "body" >
			</form>
		</td>
</tr>
</table>












	
<!--#Include virtual="/Administration/Footer2.asp"--> </Body>
</HTML>
