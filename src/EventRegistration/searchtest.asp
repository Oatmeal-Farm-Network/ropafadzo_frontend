<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.0 Transitional//EN">
<HTML>
 <HEAD>
  <TITLE> New Document </TITLE>
  <META NAME="Generator" CONTENT="EditPlus">
  <META NAME="Author" CONTENT="">
  <META NAME="Keywords" CONTENT="">
  <META NAME="Description" CONTENT="">
 <!--#Include file="globalvariables.asp"-->
  <% 


conn = "Provider=Microsoft.Jet.OLEDB.4.0;" & _
						"Data Source=" & server.mappath(databasepath) & ";" & _
						"User Id=;Password=;" 



Dim HeaderCategoryID(1000)
Dim HeaderCategoryName(1000)

Dim SubHeaderCategoryID(1000)
Dim SubHeaderCategoryName(1000)

conn = "Provider=Microsoft.Jet.OLEDB.4.0;" & _
						"Data Source=" & server.mappath(databasepath) & ";" & _
						"User Id=;Password=;" 

 sql = "select * from Categories  Order by CategoryType, CategoryName"
			'response.write(sql2)
	Set rs = Server.CreateObject("ADODB.Recordset")
    rs.Open sql, conn, 3, 3 
	If Not rs.eof Then
	SubCatCounter= 0
    OldCategoryType = rs("categoryType")


	Varieties =  Varieties  & " ["" Select a Category "", "
	While Not rs.eof 
		OldCategoryType = rs("categoryType")
		CatCounter= CatCounter +1
		HeaderCategoryID(CatCounter) = rs("CategoryID") 
		HeaderCategoryName(CatCounter) = rs("CategoryName") 
		Varieties  = Varieties & """"  & HeaderCategoryName(CatCounter)  %>
		
      

		<% rs.movenext
		    	If Not rs.eof Then 
					NewCategoryType = rs("CategoryType")
				End If 
		 If Not(OldCategoryType = NewCategoryType) then
				Varieties  = Varieties & """ ]," & vbCrLf  & " ["" Select a Category "
		End If 


			If Not(rs.eof) Then 
				Varieties  = Varieties  &  """ , " 
			 End If 
	Wend
End If 	
Varieties  = Varieties  &  """ ] " 

FinalSubCatCounter2 = SubCatCounter2
   		FinalSubCatCounter = CatCounter

'Varietielen  = Len(Varieties)
'response.write(Varietielen)
'Varieties = Left(Varieties, (Varietielen-1))
%>



<script type="text/javascript">
<!--
var varieties=[<%=Varieties%>];

function Box2IDpick(box2pick) {
var f=document.myform;
f.box2ID.value=null;

f.box2ID.value = box2pick
}


 //-->
</script>


<script type="text/javascript">
var varieties=[<%=Varieties%>];

function Box2(idx) {
var f=document.myform;
f.box2.options.length=null;
for(i=0; i<varieties[idx].length; i++) {
    f.box2.options[i]=new Option(varieties[idx][i], i); 
    }    
}

onload=function() {Box2(0);};
</script>
</HEAD>

 <BODY>


<form name="myform" method="post" action= 'SearchResults.asp' >
<table border = "0" leftmargin="0" topmargin="0" marginwidth="0" marginheight="0"  cellpadding=0 cellspacing=0 width = "400" valign = "bottom" align = "right">
	<tr>
		<td width = "400" class = "search">

<select name="Subject" onchange="Box2(this.selectedIndex)">
	<option value="Barter">Barter</option>
	<option value="Donation">Donation</option>
	<option value="For Sale">For Sale</option>
	<option value="WantAd">Wanted</option>
</select>
<select name="box2" onchange="Box2IDpick(this.selectedIndex)"></select>

	<input name="box2ID" size = "30" value = "0" type = "hidden">



				<input name="Subject" value = "<%=Subject%>" type = "hidden">
			<input type=submit value = "Search" style="background-image: url('images/background.jpg'); border-width:1px" size = "310" height = "2" class = "search" >
			
		</td>
</tr>
</table>
</form>
 </BODY>
</HTML>
